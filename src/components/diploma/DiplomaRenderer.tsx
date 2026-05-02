import { SsiapDiploma } from "./SsiapDiploma";
import { CqpApsDiploma } from "./CqpApsDiploma";
import type { Apprenant, DocumentGenere, Formation, Settings } from "@/lib/types";

interface Props {
  apprenant: Apprenant;
  formation: Formation;
  document: DocumentGenere;
  settings: Settings;
}

export function DiplomaRenderer(props: Props) {
  if (props.formation.templateId === "cqp-aps") {
    return <CqpApsDiploma {...props} />;
  }
  return <SsiapDiploma {...props} />;
}

/** Returns whether the formation renders in landscape (true) or portrait (false) */
export function isLandscapeFormation(formation: Formation): boolean {
  return formation.orientation === "landscape" || formation.templateId === "cqp-aps";
}
