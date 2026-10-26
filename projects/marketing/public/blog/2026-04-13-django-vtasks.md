---
title: "Making Django Fast: VTasks processes tasks 4x faster than Celery"
description: "Introducing django-vtasks, an async-first task queue that extends Django 6.0's task framework with scheduling, batching, and high-performance Valkey support."
author: "David Burke"
published: true
---

Django 6.0 ships a task worker framework based on the fantastic django-tasks package. This offers a simpler alternative to a heavy process like Celery. But it's intentionally minimal. Wouldn't it be nice if we could:

- Get asyncio performance
- Schedule, throttle, prioritize, and batch tasks.
- Support both Database ORM or Valkey/Redis backends.
- Write `await task.aenqueue()` and mean it - no sync worker pretending to be async.
- Keep a simplistic single process Python app for web + worker. Or run the worker as its own dedicated process.

Presenting [Django VTasks](https://django-vtasks.glitchtip.com).

VTasks extends Django 6.0's new task framework with scheduling, batching, and a high-performance Valkey backend (or slower ORM backend). It powers GlitchTip's handling of millions of error events with a single process and a single database while fitting in 512mb total system ram. VTasks runs standalone or embedded into your ASGI Django App. An asyncio loop dispatches tasks and supports sync tasks via `to_thread`. With async tasks, we get high performance and 0 thread overhead. The scheduler runs in-process and locks itself so that you can scale horizontally without thinking about it.

### Benchmarks

All benchmarks simulate async Django views dispatching tasks. Tasks sleep for 10ms to simulate a lightweight DB query or API call. Enqueue uses `await aenqueue()` for VTasks and `sync_to_async(task.delay)` for Celery — the real code you'd write in an async view.

| | Enqueue (ops/s) | Process (ops/s) | Peak RSS (MB) | Valkey Conns |
|---|---|---|---|---|
| **VTasks** | 5,203 | 3,796 | 76 | 3 |
| **Celery Threads** | 2,228 | 894 | 123 | 11 |
| **RQ** | 436 | 25 | 170 | 4 |

VTasks: 4x faster processing, 2x faster enqueue, 38% less memory, 73% fewer connections. See [full benchmarks](https://django-vtasks.glitchtip.com/benchmarks/) for methodology, cloud latency results, and how to reproduce.

VTasks simplifies the deployment of GlitchTip. It's one process and one database (valkey optional). Add valkey/redis and tasks will use the faster backend. We get the complex user stories of Celery, the minimalism of django-tasks, and speed that no other solution offers.

```python
from django_vtasks import task

@task(priority=10, unique=True)
async def process_widget_task(widget_id: int):
    """Real async task - high priority, deduplicated"""
    await Widget.objects.aget(pk=widget_id)

async def process_widget_view(request, id: int):
    """Ergonomic async usage, no sync_to_async here"""
    await process_widget_task.aenqueue(id)
```

GlitchTip uses VTasks to batch event ingest. Set your tasks to queue to a max wait time or max queue size - whichever comes first. Then process them all at once for efficiency. The Rust redis driver, from [django-vcache](https://vcache.glitchtip.com/), manages server communication fast and efficiently, using just 2 connections. Saves you money (less cpu and ram) while increasing speed.

VTasks doesn't support a full retry mechanism or result backend at this time. Tasks in progress will rescue themselves gracefully from worker restarts. This is a design decision to keep things simple — I'd consider adding support if there's demand.

**[Get started with django-vtasks](https://django-vtasks.glitchtip.com)** and [star it on GitLab](https://gitlab.com/glitchtip/django-vtasks) if you like what you see.

VTasks is built by the team behind [GlitchTip](https://glitchtip.com) — open source, sentry-sdk compatible error tracking. No VC funding, no investor roadmap, no bizarre random integration with an AI vendor. GlitchTip and VTasks are funded entirely by users. Try GlitchTip or contribute to keep development going.
