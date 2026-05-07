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
const RED  = "#c0392b";

/* Masque l'image si le fichier est vide ou absent */
function Img({ src, alt, style }: { src: string; alt: string; style: React.CSSProperties }) {
  return (
    <img
      src={src}
      alt={alt}
      crossOrigin="anonymous"
      style={style}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
    />
  );
}

export function SsiapDiploma({ apprenant, formation, document, settings }: Props) {
  const isRecyclage = formation.code.startsWith("RECYCLAGE");
  const ssiapLevel  = isRecyclage
    ? formation.code.replace("RECYCLAGE", "")
    : formation.code.replace("SSIAP", "");

  const representantNom   = document.representantNom   || settings.representantNom   || "";
  const representantGrade = document.representantGrade || settings.representantGrade || "";
  const presidentNom      = document.presidentNom      || settings.presidentNom      || "";

  const titleLine1 = isRecyclage
    ? `ATTESTATION DE RECYCLAGE S.S.I.A.P.${ssiapLevel}`
    : "DIPLOME D'AGENT DES SERVICES DE SECURITE";
  const titleLine2 = isRecyclage
    ? ssiapLevel === "1" ? "AGENT DE SÉCURITÉ INCENDIE ET D'ASSISTANCE À PERSONNES"
    : ssiapLevel === "2" ? "CHEF D'ÉQUIPE DE SÉCURITÉ INCENDIE"
    :                      "CHEF DE SERVICE DE SÉCURITÉ INCENDIE"
    : "INCENDIE ET D'ASSISTANCE A PERSONNES";

  const ssiapBadge = isRecyclage ? `RECYCLAGE S.S.I.A.P.${ssiapLevel}` : `S.S.I.A.P.${ssiapLevel}`;

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
        fontFamily: "Arial, Calibri, sans-serif",
        color: "#0a0a0a",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ── Marques de coin ── */}
      {[
        { top: "3px",    left: "3px"   },
        { top: "3px",    right: "3px"  },
        { bottom: "3px", left: "3px"   },
        { bottom: "3px", right: "3px"  },
      ].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, width: "9px", height: "9px", background: "#000", zIndex: 12 }} />
      ))}

      {/* ── Bordure externe épaisse ── */}
      <div style={{ position: "absolute", inset: "12px", border: `3px solid ${BLUE}`, pointerEvents: "none", zIndex: 10 }} />

      {/* ── Bordure interne fine ── */}
      <div style={{ position: "absolute", inset: "20px", border: `1.5px solid ${BLUE}`, pointerEvents: "none", zIndex: 10 }} />

      {/* ════ CONTENU ════ */}
      <div style={{
        position: "absolute",
        top: "28px", left: "28px", right: "28px", bottom: "58px",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* ══ EN-TÊTE ══ */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0px", marginBottom: "18px" }}>

          {/* ── Logo gauche ── */}
          <div style={{ width: "210px", flexShrink: 0, paddingRight: "18px" }}>
            {/* LX + barre noire + LEARNIX */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* L et X en serif, L rouge X noir */}
              <div style={{ display: "flex", alignItems: "baseline", lineHeight: 1 }}>
                <span style={{
                  fontSize: "56px",
                  color: RED,
                  fontFamily: "'Cormorant Garamond', 'Palatino Linotype', Georgia, serif",
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: "-1px",
                }}>L</span>
                <span style={{
                  fontSize: "56px",
                  color: "#1a1a1a",
                  fontFamily: "'Cormorant Garamond', 'Palatino Linotype', Georgia, serif",
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: "-1px",
                }}>x</span>
              </div>
              {/* Barre verticale noire épaisse */}
              <div style={{ width: "3px", height: "64px", background: "#111", margin: "0 14px", flexShrink: 0 }} />
              {/* LEARNIX + BY GROUPE KELAL */}
              <div>
                <div style={{
                  fontSize: "20px",
                  letterSpacing: "0.28em",
                  fontWeight: 300,
                  fontFamily: "Arial, sans-serif",
                  color: "#1a1a1a",
                  lineHeight: 1.1,
                }}>
                  <span style={{ color: RED, fontWeight: 400 }}>L</span>EARNIX
                </div>
                <div style={{
                  fontSize: "7.5px",
                  letterSpacing: "0.14em",
                  fontFamily: "Arial, sans-serif",
                  color: "#888",
                  marginTop: "5px",
                  fontWeight: 400,
                }}>
                  BY GROUPE KELAL
                </div>
              </div>
            </div>
            {/* Tagline */}
            <div style={{
              marginTop: "10px",
              fontSize: "9.5px",
              fontStyle: "italic",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#333",
              letterSpacing: "0.04em",
            }}>
              Ensemble apprenons l'excellence
            </div>
          </div>

          {/* ── Titre central ── */}
          <div style={{ flex: 1, textAlign: "center", paddingTop: "10px" }}>
            <div style={{
              fontSize: "16px",
              fontWeight: 700,
              color: RED,
              fontFamily: "Arial, sans-serif",
              textTransform: "uppercase",
              lineHeight: 1.4,
            }}>
              {titleLine1}<br />{titleLine2}
            </div>
            <div style={{
              fontSize: "26px",
              fontWeight: 700,
              color: RED,
              fontFamily: "Arial, sans-serif",
              marginTop: "10px",
              letterSpacing: "0.04em",
            }}>
              {ssiapBadge}
            </div>
          </div>

          {/* ── Photo ── */}
          <div style={{ flexShrink: 0, marginLeft: "14px" }}>
            {apprenant.photo ? (
              <div style={{ width: "92px", height: "116px", border: "1.5px solid #555", overflow: "hidden" }}>
                <img src={apprenant.photo} alt="photo" crossOrigin="anonymous"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{
                width: "92px", height: "116px",
                border: "1.5px dashed #999",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", color: "#888", fontFamily: "Arial, sans-serif",
              }}>
                PHOTO
              </div>
            )}
          </div>
        </div>

        {/* ══ CORPS ══ */}
        <div style={{ fontSize: "14px", lineHeight: 2.0, color: "#0a0a0a", flex: 1 }}>

          <p style={{ margin: "0 0 6px 18px" }}>
            Vu le procès-verbal du jury d'examen en date du{" "}
            <strong>{formatDate(document.dateExamen)}</strong> déclarant que :
          </p>

          <p style={{ margin: "0 0 18px 0", textAlign: "center" }}>
            Nom :{" "}<strong>{apprenant.nom || "        "}</strong>
            {"        "}
            Prénom :{" "}<strong>{apprenant.prenom || "       "}</strong>,{" "}
            {nee} le{" "}<strong>{formatDate(apprenant.dateNaissance)}</strong>{" "}
            à{" "}<strong>{lieuNaissance || "     "}</strong>.
          </p>

          <p style={{ margin: "0 0 14px 18px" }}>{bodyMain}</p>

          <p style={{ margin: "0 0 14px 0", textAlign: "center" }}>
            Diplôme N°{" "}<strong>{document.numero}</strong>
          </p>

          <p style={{ margin: "0 0 0 18px" }}>
            Fait à{" "}<strong>{document.lieu}</strong>,{" "}
            le{" "}<strong>{formatDate(document.dateObtention || document.dateExamen)}</strong>.
          </p>
        </div>

        {/* ══ SIGNATURES ══ */}
        <div style={{ display: "flex", gap: "22px" }}>

          {/* ── Président (bordure solide) ── */}
          <div style={{
            flex: 1,
            border: "1.5px solid #555",
            padding: "10px 14px 12px 14px",
            fontSize: "13px",
            boxSizing: "border-box",
          }}>
            <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "8px", textTransform: "uppercase" }}>
              Le Président du Centre de Formation
            </div>
            <div style={{ marginBottom: "4px" }}>{presidentNom}</div>
            <div style={{ marginBottom: "10px" }}>SIGNATURE</div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Img src={signImg} alt="signature" style={{ height: "52px", objectFit: "contain" }} />
              <Img src={learnixBadge} alt="cachet" style={{ height: "60px", objectFit: "contain" }} />
            </div>
          </div>

          {/* ── Représentant SDIS (bordure pointillée) ── */}
          <div style={{
            flex: 1,
            border: "1.5px dashed #555",
            padding: "10px 14px 12px 14px",
            fontSize: "13px",
            boxSizing: "border-box",
            lineHeight: 1.8,
          }}>
            <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "6px" }}>
              Le Représentant du Service incendie et<br />de secours compétent,
            </div>
            <div>Nom :{representantNom ? <span style={{ fontStyle: "italic" }}> {representantNom}</span> : " "}</div>
            <div>Grade :{representantGrade ? <span style={{ fontStyle: "italic" }}> {representantGrade}</span> : " "}</div>
            <div style={{ marginBottom: "6px" }}>Signature :</div>
            <Img src={sdisImg} alt="cachet SDIS" style={{ height: "48px", objectFit: "contain" }} />
          </div>
        </div>
      </div>

      {/* ════ FOOTER ════ */}
      <div style={{
        position: "absolute",
        left: "28px", right: "28px", bottom: "28px",
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
