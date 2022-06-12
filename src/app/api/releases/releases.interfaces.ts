import { Json } from "src/app/interface-primitives";

export interface Release {
  url: string | null;
  data: Json;
  deployCount: number;
  dateCreated: string;
  dateReleased: string | null;
  version: string;
  shortVersion: string;
  projects: unknown;
}

export interface ReleaseFile {
  sha1: string;
  name: string;
  dateCreated: string;
  headers: { [key: string]: string };
  id: string;
  size: number | null;
}
