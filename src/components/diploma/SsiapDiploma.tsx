import sdisImg from "@/assets/sdis-cachet.jpg";
import signImg from "@/assets/signature-president.jpg";
import learnixBadge from "@/assets/learnix-badge.jpg";
import { formatDate } from "@/lib/date-utils";
import type { Apprenant, DocumentGenere, Formation, Settings } from "@/lib/types";

interface Props {
  apprenant: Apprenant;
  formation: Formation;
  document: DocumentGenere;
  settings: Settings;
}

const BLUE = "#1e3a6e";
const RED  = "#cc1818";

export function SsiapDiploma({ apprenant, formation, document, settings }: Props) {
  const isRecyclage = formation.code.startsWith("RECYCLAGE");
  const ssiapLevel  = isRecyclage
    ? formation.code.replace("RECYCLAGE", "")
    : formation.code.replace("SSIAP", "");

  const representantNom   = document.representantNom   || settings.representantNom   || "";
  const representantGrade = document.representantGrade || settings.representantGrade || "";
  const presidentNom      = document.presidentNom      || settings.presidentNom      || "";

  /* ── Titres selon le type ── */
  const titleLine1 = isRecyclage
    ? `ATTESTATION DE RECYCLAGE S.S.I.A.P.${ssiapLevel}`
    : "DIPLOME D'AGENT DES SERVICES DE SECURITE";

  const titleLine2 = isRecyclage
    ? ssiapLevel === "1"
      ? "AGENT DE SÉCURITÉ INCENDIE ET D'ASSISTANCE À PERSONNES"
      : ssiapLevel === "2"
        ? "CHEF D'ÉQUIPE DE SÉCURITÉ INCENDIE"
        : "CHEF DE SERVICE DE SÉCURITÉ INCENDIE"
    : "INCENDIE ET D'ASSISTANCE A PERSONNES";

  const ssiapBadge = isRecyclage
    ? `RECYCLAGE S.S.I.A.P.${ssiapLevel}`
    : `S.S.I.A.P.${ssiapLevel}`;

  /* ── Corps texte ── */
  const bodyMain = isRecyclage
    ? <>A suivi avec succès la formation de <strong>{titleLine1} {titleLine2}</strong> conformément à l'arrêté du 02 mai 2005 modifié.</>
    : <>A subi avec succès les épreuves exigées pour l'obtention <strong>du DIPLOME D'AGENT DES SERVICES DE SECURITE INCENDIE ET D'ASSISTANCE A PERSONNES tel que défini dans l'arrêté du 02 mai 2005 modifié.</strong></>;

  const nee = apprenant.civilite === "Mme" ? "Née" : "Né";
  const lieuNaissance = [apprenant.lieuNaissance, apprenant.paysNaissance].filter(Boolean).join(" ");

  return (
    /* A4 paysage : 1123 × 794 px */
    <div
      id="diploma-render"
      style={{
        width: "1123px",
        height: "794px",
        position: "relative",
        background: "#ffffff",
        fontFamily: "'Times New Roman', Georgia, serif",
        color: "#0a0a0a",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ── Marques de coin ── */}
      {[
        { top: "3px",  left: "3px"  },
        { top: "3px",  right: "3px" },
        { bottom: "3px", left: "3px"  },
        { bottom: "3px", right: "3px" },
      ].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, width: "9px", height: "9px", background: "#000", zIndex: 12 }} />
      ))}

      {/* ── Bordure externe épaisse ── */}
      <div style={{ position: "absolute", inset: "12px", border: `3px solid ${BLUE}`, pointerEvents: "none", zIndex: 10 }} />

      {/* ── Bordure interne fine ── */}
      <div style={{ position: "absolute", inset: "20px", border: `1.5px solid ${BLUE}`, pointerEvents: "none", zIndex: 10 }} />

      {/* ════ CONTENU PRINCIPAL ════ */}
      <div style={{
        position: "absolute",
        top: "26px", left: "26px", right: "26px", bottom: "54px",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
      }}>

        {/* ══ EN-TÊTE ══ */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          paddingBottom: "10px",
          borderBottom: `1.5px solid ${BLUE}`,
          marginBottom: "14px",
        }}>

          {/* ── Logo gauche ── */}
          <div style={{
            width: "196px",
            flexShrink: 0,
            paddingRight: "16px",
            borderRight: `1.5px solid ${BLUE}`,
            marginRight: "20px",
          }}>
            {/* LX + barre + LEARNIX */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "1px", lineHeight: 1 }}>
                <span style={{ fontSize: "46px", fontWeight: 900, color: RED, fontFamily: "Arial Black, sans-serif", lineHeight: 1 }}>L</span>
                <span style={{ fontSize: "37px", fontWeight: 900, color: RED, fontFamily: "Arial Black, sans-serif", lineHeight: 1, marginBottom: "3px" }}>X</span>
              </div>
              <div style={{ width: "2px", height: "54px", background: BLUE, margin: "0 9px 0 7px", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "15px", fontWeight: 900, color: BLUE, letterSpacing: "0.18em", fontFamily: "Arial, sans-serif", lineHeight: 1.1 }}>
                  LEARNIX
                </div>
                <div style={{ fontSize: "6.5px", color: BLUE, letterSpacing: "0.07em", fontFamily: "Arial, sans-serif", marginTop: "3px" }}>
                  BY GROUPE KELAL
                </div>
              </div>
            </div>
            {/* Tagline */}
            <div style={{ marginTop: "7px", fontSize: "9px", fontStyle: "italic", color: "#333", fontFamily: "Georgia, serif", letterSpacing: "0.03em" }}>
              Ensemble apprenons l'excellence
            </div>
          </div>

          {/* ── Titre central ── */}
          <div style={{ flex: 1, textAlign: "center", paddingTop: "8px" }}>
            <div style={{
              fontSize: "15.5px",
              fontWeight: 900,
              color: RED,
              fontFamily: "Arial Black, sans-serif",
              textTransform: "uppercase",
              lineHeight: 1.35,
            }}>
              {titleLine1}<br />{titleLine2}
            </div>
            <div style={{
              fontSize: "25px",
              fontWeight: 900,
              color: RED,
              fontFamily: "Arial Black, sans-serif",
              marginTop: "8px",
              letterSpacing: "0.05em",
            }}>
              {ssiapBadge}
            </div>
          </div>

          {/* ── Photo ── */}
          <div style={{ flexShrink: 0, marginLeft: "16px" }}>
            {apprenant.photo ? (
              <div style={{ width: "90px", height: "112px", border: "1.5px solid #555", overflow: "hidden" }}>
                <img src={apprenant.photo} alt="photo" crossOrigin="anonymous"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{
                width: "90px", height: "112px",
                border: "1.5px dashed #888",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", color: "#777", fontFamily: "Arial, sans-serif",
              }}>
                PHOTO
              </div>
            )}
          </div>
        </div>

        {/* ══ CORPS ══ */}
        <div style={{ fontSize: "13px", lineHeight: 1.9, color: "#0a0a0a", flex: 1, paddingLeft: "8px" }}>

          <p style={{ margin: "0 0 2px 0" }}>
            Vu le procès-verbal du jury d'examen en date du{" "}
            <strong>{formatDate(document.dateExamen)}</strong> déclarant que :
          </p>

          <p style={{ margin: "0 0 10px 0", textAlign: "center" }}>
            Nom :{" "}<strong>{apprenant.nom}</strong>
            {"      "}
            Prénom :{" "}<strong>{apprenant.prenom}</strong>,{" "}
            {nee} le{" "}<strong>{formatDate(apprenant.dateNaissance)}</strong>{" "}
            à{" "}<strong>{lieuNaissance || "     "}</strong>.
          </p>

          <p style={{ margin: "0 0 8px 0" }}>{bodyMain}</p>

          <p style={{ margin: "0 0 8px 0", textAlign: "center" }}>
            Diplôme N°{" "}<strong>{document.numero}</strong>
          </p>

          <p style={{ margin: "0 0 0 0" }}>
            Fait à{" "}<strong>{document.lieu}</strong>,{" "}
            le{" "}<strong>{formatDate(document.dateObtention || document.dateExamen)}</strong>.
          </p>
        </div>

        {/* ══ SIGNATURES ══ */}
        <div style={{ display: "flex", gap: "24px", marginTop: "10px" }}>

          {/* ── Président (bordure solide) ── */}
          <div style={{
            flex: 1,
            border: "1.5px solid #333",
            padding: "10px 14px",
            fontSize: "12.5px",
            minHeight: "148px",
            boxSizing: "border-box",
          }}>
            <div style={{ fontWeight: 900, fontSize: "12.5px", marginBottom: "6px", fontFamily: "Arial, sans-serif", textTransform: "uppercase" }}>
              Le Président du Centre de Formation
            </div>
            <div style={{ marginBottom: "2px" }}>{presidentNom}</div>
            <div style={{ marginBottom: "8px" }}>SIGNATURE</div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={signImg} alt="signature" crossOrigin="anonymous"
                style={{ height: "50px", objectFit: "contain" }} />
              <img src={learnixBadge} alt="cachet" crossOrigin="anonymous"
                style={{ height: "58px", objectFit: "contain" }} />
            </div>
          </div>

          {/* ── Représentant SDIS (bordure pointillée) ── */}
          <div style={{
            flex: 1,
            border: "1.5px dashed #333",
            padding: "10px 14px",
            fontSize: "12.5px",
            minHeight: "148px",
            boxSizing: "border-box",
            lineHeight: 1.75,
          }}>
            <div style={{ fontWeight: 700, fontSize: "12.5px", marginBottom: "6px" }}>
              Le Représentant du Service incendie et<br />de secours compétent,
            </div>
            <div>Nom :{" "}{representantNom && <span style={{ fontStyle: "italic" }}>{representantNom}</span>}</div>
            <div>Grade :{" "}{representantGrade && <span style={{ fontStyle: "italic" }}>{representantGrade}</span>}</div>
            <div>Signature :</div>
            {sdisImg && (
              <img src={sdisImg} alt="cachet SDIS" crossOrigin="anonymous"
                style={{ height: "46px", objectFit: "contain", marginTop: "4px" }} />
            )}
          </div>
        </div>
      </div>

      {/* ════ FOOTER ════ */}
      <div style={{
        position: "absolute",
        left: "26px", right: "26px", bottom: "26px",
        borderTop: `1px solid ${BLUE}`,
        paddingTop: "5px",
        fontSize: "7.5px",
        color: "#1a1a1a",
        textAlign: "center",
        zIndex: 5,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.65,
      }}>
        <strong>LEARNIX Organisme</strong> de formation Formations incendie agrée SSIAP 1, 2, 3 sous le n° d'agrément : {settings.centreAgrement}
        <br />
        Déclaration d'existence N° {settings.centreDeclaration} · Siret : {settings.centreSiret}
        <br />
        Tél. : {settings.centreTel} · E-mail : {settings.centreEmail}
      </div>
    </div>
  );
}
