export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

export type JsonArrayOrObject = Json[] | { [key: string]: Json };
