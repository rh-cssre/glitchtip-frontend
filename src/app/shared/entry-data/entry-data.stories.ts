import { EntryDataComponent } from "../entry-data/entry-data.component";

export default {
  title: "Shared/Entry Data",
  component: EntryDataComponent,
};

export const EntryData = () => ({
  props: {
    key: "Accept-Encoding",
    value: "gzip, deflate, br",
  },
});

EntryData.story = {
  parameters: { name: "Entry Data" },
};
