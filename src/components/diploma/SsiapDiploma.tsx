import { useEffect, useState } from "react";
import QRCode from "qrcode";
import sdisImg from "@/assets/sdis-cachet.jpg";
import signImg from "@/assets/signature-president.jpg";
import learnixBadge from "@/assets/learnix-badge.jpg";
import { formatDate, formatDateLong } from "@/lib/date-utils";
import type { Apprenant, DocumentGenere, Formation, Settings } from "@/lib/types";

interface Props {
  apprenant: Apprenant;
  formation: Formation;
  document: DocumentGenere;
  settings: Settings;
}

export function SsiapDiploma({ apprenant, formation, document, settings }: Props) {
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    const verifyUrl = `${settings.verificationBaseUrl}/verification/${document.numero}`;
    QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 120,
      color: { dark: "#000000", light: "#ffffff" },
    }).then(setQrUrl);
  }, [document.numero, settings.verificationBaseUrl]);

  const isRecyclage = formation.code.startsWith("RECYCLAGE");
  const isSsiap = formation.code.startsWith("SSIAP") || isRecyclage;
  const ssiapLevel = isRecyclage
    ? formation.code.replace("RECYCLAGE", "")
    : formation.code.replace("SSIAP", "");

  // Fallback sur les settings si le document n'a pas de valeur
  const representantNom = document.representantNom || settings.representantNom || "";
  const representantGrade = document.representantGrade || settings.representantGrade || "";
  const presidentNom = document.presidentNom || settings.presidentNom || "";

  const titrePrincipal = isRecyclage
    ? `RECYCLAGE SSIAP ${ssiapLevel}`
    : isSsiap
      ? `S.S.I.A.P.${ssiapLevel}`
      : formation.code;

  const diplomeTitre = isRecyclage
    ? ssiapLevel === "1"
      ? "ATTESTATION DE RECYCLAGE SSIAP 1 — AGENT DE SÉCURITÉ INCENDIE ET D'ASSISTANCE À PERSONNES"
      : ssiapLevel === "2"
        ? "ATTESTATION DE RECYCLAGE SSIAP 2 — CHEF D'ÉQUIPE DE SÉCURITÉ INCENDIE"
        : "ATTESTATION DE RECYCLAGE SSIAP 3 — CHEF DE SERVICE DE SÉCURITÉ INCENDIE"
    : isSsiap
      ? ssiapLevel === "1"
        ? "DIPLÔME D'AGENT DES SERVICES DE SÉCURITÉ INCENDIE ET D'ASSISTANCE À PERSONNES"
        : ssiapLevel === "2"
          ? "DIPLÔME DE CHEF D'ÉQUIPE DE SÉCURITÉ INCENDIE ET D'ASSISTANCE À PERSONNES"
          : "DIPLÔME DE CHEF DE SERVICE DE SÉCURITÉ INCENDIE"
      : `DIPLÔME — ${formation.nom.toUpperCase()}`;

  return (
    <div
      id="diploma-render"
      style={{
        width: "794px",
        height: "1123px",
        position: "relative",
        background: "#ffffff",
        fontFamily: "'Times New Roman', Georgia, serif",
        color: "#0a0a0a",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ── Bordure externe bleue épaisse ── */}
      <div style={{ position: "absolute", inset: "8px", border: "3px solid #1e3a6e", pointerEvents: "none", zIndex: 10 }} />
      {/* ── Bordure interne bleue fine ── */}
      <div style={{ position: "absolute", inset: "14px", border: "1.5px solid #1e3a6e", pointerEvents: "none", zIndex: 10 }} />

      {/* ── Coins décoratifs ── */}
      {[
        { top: "18px", left: "18px" },
        { top: "18px", right: "18px" },
        { bottom: "18px", left: "18px" },
        { bottom: "18px", right: "18px" },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: "14px",
            height: "14px",
            border: "2px solid #1e3a6e",
            pointerEvents: "none",
            zIndex: 11,
          }}
        />
      ))}

      {/* ────────────────────── ZONE PRINCIPALE ────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: "22px",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ══ HAUT : logo gauche | titre centre | photo droite ══ */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0px", minHeight: "200px" }}>

          {/* ── Colonne LOGO LEARNIX ── */}
          <div
            style={{
              width: "185px",
              flexShrink: 0,
              paddingTop: "8px",
              paddingRight: "18px",
              borderRight: "2px solid #1e3a6e",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {/* LX grand */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", lineHeight: 1 }}>
              <span style={{ fontSize: "52px", fontWeight: 900, color: "#1e3a6e", fontFamily: "Arial Black, sans-serif", lineHeight: 1 }}>
                L
              </span>
              <span style={{ fontSize: "42px", fontWeight: 900, color: "#1e3a6e", fontFamily: "Arial Black, sans-serif", lineHeight: 1, marginBottom: "2px" }}>
                X
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 900, letterSpacing: "0.15em", color: "#1e3a6e", marginTop: "2px", fontFamily: "Arial, sans-serif" }}>
              LEARNIX
            </div>
            <div style={{ fontSize: "7.5px", letterSpacing: "0.05em", color: "#444", marginTop: "1px", fontFamily: "Arial, sans-serif" }}>
              DU GROUPE KELAL
            </div>
            <div style={{ width: "100%", height: "1px", background: "#1e3a6e", margin: "6px 0" }} />
            <div style={{ fontSize: "8px", color: "#555", fontStyle: "italic", fontFamily: "'Times New Roman', serif" }}>
              Ensemble apprenons l'excellence
            </div>
          </div>

          {/* ── Titre central ── */}
          <div
            style={{
              flex: 1,
              paddingLeft: "22px",
              paddingTop: "8px",
              paddingRight: "12px",
            }}
          >
            {/* Titre rouge */}
            <div
              style={{
                fontSize: "15.5px",
                fontWeight: 900,
                color: "#b91c1c",
                letterSpacing: "0.04em",
                lineHeight: 1.3,
                textTransform: "uppercase",
                fontFamily: "Arial Black, sans-serif",
              }}
            >
              DIPLOME D'AGENT DES SERVICES DE SECURITE INCENDIE ET D'ASSISTANCE A PERSONNES
            </div>

            {/* S.S.I.A.P. N ou RECYCLAGE */}
            <div
              style={{
                fontSize: isRecyclage ? "22px" : "28px",
                fontWeight: 900,
                color: "#b91c1c",
                letterSpacing: "0.1em",
                marginTop: "10px",
                fontFamily: "Arial Black, sans-serif",
              }}
            >
              {titrePrincipal}
            </div>
          </div>

          {/* ── Photo candidat ── */}
          <div style={{ flexShrink: 0 }}>
            {apprenant.photo ? (
              <div
                style={{
                  width: "105px",
                  height: "130px",
                  border: "2px solid #333",
                  overflow: "hidden",
                  background: "#eee",
                }}
              >
                <img
                  src={apprenant.photo}
                  alt="photo candidat"
                  crossOrigin="anonymous"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: "105px",
                  height: "130px",
                  border: "2px dashed #999",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  color: "#999",
                }}
              >
                Photo
              </div>
            )}
          </div>
        </div>

        {/* ══ CORPS OFFICIEL ══ */}
        <div style={{ marginTop: "26px", fontSize: "13.5px", lineHeight: 1.75, color: "#0a0a0a" }}>
          <p>
            Vu le procès-verbal du jury d'examen en date du{" "}
            <strong>{formatDateLong(document.dateExamen)}</strong> déclarant que :
          </p>

          <p style={{ marginTop: "8px" }}>
            Nom : <strong>{apprenant.nom}</strong>{"  "}
            Prénom : <strong>{apprenant.prenom}</strong>,{" "}
            Né{apprenant.civilite === "Mme" ? "e" : ""} le{" "}
            <strong>{formatDate(apprenant.dateNaissance)}</strong> à{" "}
            <strong>{apprenant.lieuNaissance}{apprenant.paysNaissance ? ` ${apprenant.paysNaissance}` : ""}</strong>.
          </p>

          <p style={{ marginTop: "10px" }}>
            {isRecyclage
              ? <>A suivi avec succès la formation de <strong>{diplomeTitre}</strong> conformément à l'arrêté du 02 mai 2005 modifié.</>
              : <>A subi avec succès les épreuves exigées pour l'obtention <strong>du {diplomeTitre} tel que défini dans l'arrêté du 02 mai 2005 modifié.</strong></>
            }
          </p>
        </div>

        {/* ══ NUMÉRO DIPLÔME ══ */}
        <div style={{ marginTop: "20px", fontSize: "13.5px" }}>
          Diplôme N° <strong style={{ letterSpacing: "0.05em" }}>{document.numero}</strong>
        </div>

        {/* ══ LIEU / DATE ══ */}
        <div style={{ marginTop: "14px", fontSize: "13.5px" }}>
          Fait à <strong>{document.lieu}</strong>, le <strong>{formatDateLong(document.dateObtention || document.dateExamen)}</strong>.
        </div>

        {/* ══ SIGNATURES ══ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: "30px",
            gap: "16px",
            flex: 1,
          }}
        >
          {/* ── Président du Centre ── */}
          <div style={{ flex: 1, fontSize: "12px" }}>
            <div
              style={{
                fontWeight: 900,
                fontSize: "12.5px",
                textDecoration: "underline",
                marginBottom: "8px",
                fontFamily: "Arial, sans-serif",
                textTransform: "uppercase",
              }}
            >
              LE PRESIDENT DU CENTRE DE FORMATION
            </div>
            <div style={{ marginBottom: "4px" }}>{presidentNom}</div>
            <div style={{ marginBottom: "8px" }}>SIGNATURE</div>

            {/* Signature + cachet */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
              <img
                src={signImg}
                alt="signature"
                crossOrigin="anonymous"
                style={{ height: "56px", objectFit: "contain" }}
              />
              <img
                src={learnixBadge}
                alt="cachet learnix"
                crossOrigin="anonymous"
                style={{ height: "64px", objectFit: "contain" }}
              />
            </div>
          </div>

          {/* ── QR code centré ── */}
          {qrUrl && (
            <div style={{ textAlign: "center", flexShrink: 0, fontSize: "7.5px", color: "#555" }}>
              <img src={qrUrl} alt="QR vérification" style={{ width: "64px", height: "64px", display: "block", margin: "0 auto" }} />
              <div style={{ marginTop: "3px", fontFamily: "Arial, sans-serif" }}>Vérification</div>
            </div>
          )}

          {/* ── Représentant SDIS — box pointillée ── */}
          <div
            style={{
              flex: 1,
              border: "1.5px dashed #333",
              padding: "10px 12px",
              fontSize: "12px",
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: "6px", fontSize: "12px" }}>
              Le Représentant du Service incendie et<br />
              de secours compétent,
            </div>
            <div>Nom : <span style={{ fontStyle: "italic" }}>{representantNom}</span></div>
            <div>Grade : <span style={{ fontStyle: "italic" }}>{representantGrade}</span></div>
            <div style={{ marginTop: "4px" }}>Signature :</div>
            <div style={{ marginTop: "6px" }}>
              <img
                src={sdisImg}
                alt="cachet SDIS"
                crossOrigin="anonymous"
                style={{ height: "60px", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ────────── FOOTER ────────── */}
      <div
        style={{
          position: "absolute",
          left: "22px",
          right: "22px",
          bottom: "22px",
          borderTop: "1px solid #1e3a6e",
          paddingTop: "6px",
          fontSize: "8.5px",
          color: "#1a1a1a",
          textAlign: "center",
          zIndex: 5,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <span style={{ fontWeight: 700 }}>
          LEARNIX Organisme de formation Formations incendie agrée SSIAP 1, 2, 3 sous le n° d'agrément : {settings.centreAgrement}
        </span>
        <br />
        Déclaration d'existence N° {settings.centreDeclaration} · Siret : {settings.centreSiret}
        <br />
        Tél : {settings.centreTel} · E-mail : {settings.centreEmail}
      </div>
    </div>
  );
}
