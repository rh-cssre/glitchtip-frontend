---
title: "Making Django faster: django-vcache"
description: "Introducing django-vcache, a Rust-backed Valkey cache that is 17x faster than standard Django Redis cache under high concurrency."
author: "David Burke"
published: true
---

Django's async cache story is incomplete. RedisCache wraps every async call in sync_to_async. At low scale, you won't notice because WSGI (especially with threads) is good enough. But GlitchTip needs to handle seriously bursty traffic efficiently. We need to process error events, logs, spans, etc. and quickly check permissions/quotas via cache. Finally, we must quickly write the event into Valkey for batch processing.

`cache.get("throttle_foo")` > Dispatch thread > Run synchronous redis-py  > Get connection from pool (or create new) > return result.

This is slow for a few reasons. There is overhead on threading. Redis-py is pretty slow. In our benchmarks, redis-py with hiredis itself is significantly slower than Rust-based clients like valkey-glide under high concurrency. At low concurrency you won't see it.

But what does slow mean? We need to define the goal. When I say fast and efficient I mean doing more work quickly with less resources (cpu/memory, which is to say money). Write the most unoptimized code you can but throw a massive k8s cluster at it and it will be "fast" at high concurrency. GlitchTip is not a VC funded mega venture. We need efficiency. Do the work with less ram, less cpu time. We need a benchmark that introduces some minor latency and high concurrency.

### Throughput (uncapped, 300 concurrency, 30s)

| | django-vcache | django-valkey | Django RedisCache |
|---|---|---|---|
| **Requests/sec** | 1,643 | 1,125 | 284 |
| **Avg latency** | 182 ms | 266 ms | 1,047 ms |
| **P99 latency** | 197 ms | 292 ms | 1,188 ms |
| **Peak RSS** | 213 MB | 177 MB | 600 MB |
| **Valkey connections** | 2 | 301 | 4,480 |

### Memory efficiency (rate-limited to 1,000 req/s, 250 concurrency, 120s)

To compare memory fairly, all backends are rate-limited to the same throughput:

| | django-vcache | django-valkey | Django RedisCache |
|---|---|---|---|
| **Actual req/s** | 999 | 999 | 300 (can't keep up) |
| **Peak RSS** | 109 MB | 135 MB | 1,739 MB |
| **Valkey connections** | 3 | 252 | 9,926 |

These results aren't theoretical, django-vcache is here today and in production. Async becomes a first-class citizen while sync is still there when you need it. I used the Rust redis crate with a Python bridge that returns an Awaitable for async. It's 17x faster than stock Django Redis cache and uses just two connections (our benchmark clocks redis-py at 2,694).
Migration is trivial:  `pip install django-vcache` and update CACHES:
```
  # Before                                                                                                                                                                                    
  CACHES = {      
      "default": {
          "BACKEND": "django.core.cache.backends.redis.RedisCache",
          "LOCATION": "redis://localhost:6379/1",
      }                                                                                                                                                                                       
  }
                                                                                                                                                                                              
  # After         
  CACHES = {
      "default": {
          "BACKEND": "django_vcache.ValkeyCache",
          "LOCATION": "redis://localhost:6379/1",                                                                                                                                             
      }
  }
```     

Your get calls work but slightly faster. Write await cache.aget(x) with ASGI and it's even better.

If you were truly insane you might even rewrite your own hot paths in Rust with pyo3 and call this one valkey/redis connection right from Rust. Or maybe run a django tasks background worker embedded in ASGI, all powered by this singular and fast Valkey connection. But that is a topic for another day. Give django-vcache a try in your own Django project and tell me what you think: https://vcache.glitchtip.com/
