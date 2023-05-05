import { Observable, map } from "rxjs";
import { APIProjectDetail, ProjectDetail } from "./projects-api.interfaces";

export function detailIdsToIntPipe(input: Observable<APIProjectDetail>) {
  return input.pipe(
    map((apiProjectDetail) => {
      return {
        ...apiProjectDetail,
        id: parseInt(apiProjectDetail.id, 10),
      } as ProjectDetail;
    })
  );
}
