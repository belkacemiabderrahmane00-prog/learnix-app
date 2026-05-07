import { useEffect, useState } from "react";
import QRCode from "qrcode";
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
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    const verifyUrl = `${settings.verificationBaseUrl}/verification/${document.numero}`;
    QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 72,
      color: { dark: "#000000", light: "#ffffff" },
    }).then(setQrUrl);
  }, [document.numero, settings.verificationBaseUrl]);

  const isRecyclage = formation.code.startsWith("RECYCLAGE");
  const ssiapLevel  = isRecyclage
    ? formation.code.replace("RECYCLAGE", "")
    : formation.code.replace("SSIAP", "");

  const representantNom   = document.representantNom   || settings.representantNom   || "";
  const representantGrade = document.representantGrade || settings.representantGrade || "";
  const presidentNom      = document.presidentNom      || settings.presidentNom      || "";

  /* ── titre principal (sous le grand titre rouge) ── */
  const ssiapCode = isRecyclage ? `RECYCLAGE S.S.I.A.P.${ssiapLevel}` : `S.S.I.A.P.${ssiapLevel}`;

  /* ── grand titre rouge (deux lignes) ── */
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

  /* ── texte du corps principal ── */
  const bodyText = isRecyclage
    ? <>A suivi avec succès la formation de <strong>{titleLine1} {titleLine2}</strong> conformément à l'arrêté du 02 mai 2005 modifié.</>
    : <>A subi avec succès les épreuves exigées pour l'obtention <strong>du DIPLOME D'AGENT DES SERVICES DE SECURITE INCENDIE ET D'ASSISTANCE A PERSONNES tel que défini dans l'arrêté du 02 mai 2005 modifié.</strong></>;

  /* ── "Né(e) le" ── */
  const nee = apprenant.civilite === "Mme" ? "Née" : "Né";
  const lieuNaissance = [apprenant.lieuNaissance, apprenant.paysNaissance].filter(Boolean).join(" ");

  return (
    /* A4 landscape : 1123 × 794 px */
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
      {/* ── Marques de coin (impression) ── */}
      {(["topLeft","topRight","bottomLeft","bottomRight"] as const).map((c) => (
        <div
          key={c}
          style={{
            position: "absolute",
            width: "8px", height: "8px",
            background: "#000",
            zIndex: 12,
            ...(c === "topLeft"     ? { top: "4px",  left: "4px"  } : {}),
            ...(c === "topRight"    ? { top: "4px",  right: "4px" } : {}),
            ...(c === "bottomLeft"  ? { bottom: "4px", left: "4px"  } : {}),
            ...(c === "bottomRight" ? { bottom: "4px", right: "4px" } : {}),
          }}
        />
      ))}

      {/* ── Bordure externe épaisse ── */}
      <div style={{
        position: "absolute", inset: "12px",
        border: `3px solid ${BLUE}`,
        pointerEvents: "none", zIndex: 10,
      }} />

      {/* ── Bordure interne fine ── */}
      <div style={{
        position: "absolute", inset: "20px",
        border: `1.5px solid ${BLUE}`,
        pointerEvents: "none", zIndex: 10,
      }} />

      {/* ════════════════════ ZONE PRINCIPALE ════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: "26px", left: "26px", right: "26px", bottom: "56px",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: "0px",
        }}
      >
        {/* ══ HAUT : logo | titre | photo ══ */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0px", paddingBottom: "12px", borderBottom: `1px solid ${BLUE}` }}>

          {/* ── Bloc logo gauche ── */}
          <div style={{ width: "210px", flexShrink: 0, paddingRight: "18px", borderRight: `1.5px solid ${BLUE}` }}>
            {/* LX + séparateur + LEARNIX */}
            <div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "1px", lineHeight: 1 }}>
                <span style={{ fontSize: "46px", fontWeight: 900, color: RED, fontFamily: "Arial Black, sans-serif", lineHeight: 1 }}>L</span>
                <span style={{ fontSize: "38px", fontWeight: 900, color: RED, fontFamily: "Arial Black, sans-serif", lineHeight: 1, marginBottom: "3px" }}>X</span>
              </div>
              {/* Barre verticale */}
              <div style={{ width: "2px", height: "56px", background: BLUE, margin: "0 10px 0 8px", flexShrink: 0 }} />
              {/* Texte LEARNIX */}
              <div>
                <div style={{ fontSize: "15px", fontWeight: 900, color: BLUE, letterSpacing: "0.18em", fontFamily: "Arial, sans-serif", lineHeight: 1.1 }}>
                  LEARNIX
                </div>
                <div style={{ fontSize: "7px", color: BLUE, letterSpacing: "0.06em", fontFamily: "Arial, sans-serif", marginTop: "2px" }}>
                  BY GROUPE KELAL
                </div>
              </div>
            </div>
            <div style={{ marginTop: "8px", fontSize: "9px", fontStyle: "italic", color: "#444", fontFamily: "Georgia, serif", letterSpacing: "0.04em" }}>
              Ensemble apprenons l'excellence
            </div>
          </div>

          {/* ── Titre central ── */}
          <div style={{ flex: 1, textAlign: "center", paddingLeft: "20px", paddingRight: "12px", paddingTop: "6px" }}>
            <div style={{
              fontSize: "15.5px",
              fontWeight: 900,
              color: RED,
              fontFamily: "Arial Black, sans-serif",
              textTransform: "uppercase",
              lineHeight: 1.35,
              letterSpacing: "0.02em",
            }}>
              {titleLine1}<br />{titleLine2}
            </div>
            <div style={{
              fontSize: "24px",
              fontWeight: 900,
              color: RED,
              fontFamily: "Arial Black, sans-serif",
              marginTop: "8px",
              letterSpacing: "0.06em",
            }}>
              {ssiapCode}
            </div>
          </div>

          {/* ── Photo candidat ── */}
          <div style={{ flexShrink: 0 }}>
            {apprenant.photo ? (
              <div style={{
                width: "88px", height: "110px",
                border: "1.5px solid #333",
                overflow: "hidden",
              }}>
                <img
                  src={apprenant.photo}
                  alt="photo candidat"
                  crossOrigin="anonymous"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : (
              <div style={{
                width: "88px", height: "110px",
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
        <div style={{ fontSize: "13px", lineHeight: 1.85, color: "#0a0a0a", padding: "14px 4px 0 4px", flex: 1 }}>
          {/* Ligne 1 */}
          <p style={{ margin: "0 0 4px 0" }}>
            Vu le procès-verbal du jury d'examen en date du{" "}
            <strong>{formatDate(document.dateExamen)}</strong> déclarant que :
          </p>

          {/* Ligne 2 — centré */}
          <p style={{ margin: "0 0 10px 0", textAlign: "center" }}>
            Nom :{" "}<strong>{apprenant.nom || "        "}</strong>
            {"          "}
            Prénom :{" "}<strong>{apprenant.prenom || "       "}</strong>,{" "}
            {nee} le{" "}<strong>{formatDate(apprenant.dateNaissance)}</strong>{" "}
            à{" "}<strong>{lieuNaissance || "."}</strong>.
          </p>

          {/* Ligne 3 — corps officiel */}
          <p style={{ margin: "0 0 10px 0" }}>{bodyText}</p>

          {/* Numéro diplôme — centré */}
          <p style={{ margin: "0 0 10px 0", textAlign: "center" }}>
            Diplôme N°{" "}<strong style={{ letterSpacing: "0.04em" }}>{document.numero}</strong>
          </p>

          {/* Fait à */}
          <p style={{ margin: "0" }}>
            Fait à{" "}<strong>{document.lieu}</strong>,{" "}
            le{" "}<strong>{formatDate(document.dateObtention || document.dateExamen)}</strong>.
          </p>
        </div>

        {/* ══ SIGNATURES ══ */}
        <div style={{ display: "flex", gap: "20px", alignItems: "stretch", paddingTop: "8px" }}>

          {/* ── Président (bordure solide) ── */}
          <div style={{
            flex: 1,
            border: "1.5px solid #333",
            padding: "10px 14px 10px 14px",
            fontSize: "12px",
            minHeight: "145px",
            boxSizing: "border-box",
          }}>
            <div style={{
              fontWeight: 900,
              fontSize: "12px",
              marginBottom: "6px",
              fontFamily: "Arial, sans-serif",
              textTransform: "uppercase",
            }}>
              Le Président du Centre de Formation
            </div>
            <div style={{ marginBottom: "2px" }}>{presidentNom}</div>
            <div style={{ marginBottom: "8px" }}>SIGNATURE</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img
                src={signImg}
                alt="signature"
                crossOrigin="anonymous"
                style={{ height: "50px", objectFit: "contain" }}
              />
              <img
                src={learnixBadge}
                alt="cachet learnix"
                crossOrigin="anonymous"
                style={{ height: "58px", objectFit: "contain" }}
              />
            </div>
          </div>

          {/* ── QR code (centre, discret) ── */}
          {qrUrl && (
            <div style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: "6px",
              fontSize: "6.5px",
              color: "#777",
              fontFamily: "Arial, sans-serif",
              gap: "2px",
            }}>
              <img src={qrUrl} alt="QR vérification" style={{ width: "52px", height: "52px" }} />
              <span>Vérification</span>
            </div>
          )}

          {/* ── Représentant SDIS (bordure pointillée) ── */}
          <div style={{
            flex: 1,
            border: "1.5px dashed #333",
            padding: "10px 14px",
            fontSize: "12px",
            minHeight: "145px",
            boxSizing: "border-box",
            lineHeight: 1.7,
          }}>
            <div style={{ fontWeight: 700, marginBottom: "6px", fontSize: "12px" }}>
              Le Représentant du Service incendie et<br />de secours compétent,
            </div>
            <div>Nom : <span style={{ fontStyle: "italic" }}>{representantNom}</span></div>
            <div>Grade : <span style={{ fontStyle: "italic" }}>{representantGrade}</span></div>
            <div>Signature :</div>
            <div style={{ marginTop: "4px" }}>
              <img
                src={sdisImg}
                alt="cachet SDIS"
                crossOrigin="anonymous"
                style={{ height: "48px", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════ FOOTER ════════════════════ */}
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
        lineHeight: 1.6,
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
