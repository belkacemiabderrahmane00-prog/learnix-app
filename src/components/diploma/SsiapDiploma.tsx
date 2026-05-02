import { useEffect, useState } from "react";
import QRCode from "qrcode";
import sdisImg from "@/assets/sdis-cachet.jpg";
import signImg from "@/assets/signature-president.jpg";
import { formatDate, formatDateLong } from "@/lib/date-utils";
import type { Apprenant, DocumentGenere, Formation, Settings } from "@/lib/types";

interface Props {
  apprenant: Apprenant;
  formation: Formation;
  document: DocumentGenere;
  settings: Settings;
}

/**
 * Diplôme SSIAP A4 portrait — reproduction fidèle du template officiel HATHOUT PDF.
 * Dimensions canoniques : 794 x 1123 px (A4 portrait @ 96 dpi).
 * Exporté en PDF via html2canvas (échelle x2.5).
 */
export function SsiapDiploma({ apprenant, formation, document, settings }: Props) {
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    const verifyUrl = `${settings.verificationBaseUrl}/verification/${document.numero}`;
    QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 160,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    }).then(setQrUrl);
  }, [document.numero, settings.verificationBaseUrl]);

  const ssiapLevel = formation.code.replace("SSIAP", "");
  const isSsiap = formation.code.startsWith("SSIAP");

  const civilite = apprenant.civilite ?? "M.";

  return (
    <div
      id="diploma-render"
      style={{
        width: "794px",
        height: "1123px",
        position: "relative",
        background: "#ffffff",
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: "#0a0a0a",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Bordure épaisse externe */}
      <div
        style={{
          position: "absolute",
          inset: "10px",
          border: "3px solid #1a1a1a",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      {/* Bordure fine interne */}
      <div
        style={{
          position: "absolute",
          inset: "16px",
          border: "1px solid #555",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Filigrane central — texte LEARNIX en arrière-plan */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-30deg)",
          fontSize: "90px",
          fontWeight: 900,
          color: "rgba(185,28,28,0.04)",
          letterSpacing: "0.2em",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        LEARNIX
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-30deg)",
          fontSize: "44px",
          fontWeight: 700,
          color: "rgba(185,28,28,0.035)",
          letterSpacing: "0.1em",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
          marginTop: "80px",
        }}
      >
        SÉCURITÉ INCENDIE ET D'ASSISTANCE
      </div>

      {/* ────────── COLONNE GAUCHE : titre vertical ────────── */}
      <div
        style={{
          position: "absolute",
          left: "22px",
          top: "80px",
          bottom: "80px",
          width: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <div
          style={{
            transform: "rotate(-90deg)",
            whiteSpace: "nowrap",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "#1a1a1a",
            textTransform: "uppercase",
          }}
        >
          DIPLOME D'AGENT DES SERVICES DE SECURITE INCENDIE ET D'ASSISTANCE A PERSONNES
        </div>
      </div>

      {/* ────────── CONTENU PRINCIPAL ────────── */}
      <div
        style={{
          position: "absolute",
          left: "68px",
          right: "24px",
          top: "24px",
          bottom: "24px",
          zIndex: 2,
        }}
      >
        {/* ZONE HAUTE : sceau + photo */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingTop: "14px",
          }}
        >
          {/* Sceau LEARNIX (gauche) */}
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: "2.5px solid #1a1a1a",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "8px",
              background: "#fff",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 900, letterSpacing: "0.1em", color: "#b91c1c" }}>LEARNIX</div>
            <div style={{ fontSize: "7px", marginTop: "2px", color: "#333", lineHeight: 1.3, letterSpacing: "0.04em" }}>
              ORGANISME DE FORMATION
            </div>
            <div style={{ width: "70%", height: "1px", background: "#1a1a1a", margin: "4px auto" }} />
            <div style={{ fontSize: "6.5px", color: "#333", lineHeight: 1.35, letterSpacing: "0.03em" }}>
              Formations incendie<br />
              agréé SSIAP 1, 2, 3<br />
              N° {settings.centreAgrement}
            </div>
          </div>

          {/* Photo candidat (droite) */}
          {apprenant.photo ? (
            <div
              style={{
                width: "110px",
                height: "140px",
                border: "2px solid #1a1a1a",
                background: "#eee",
                overflow: "hidden",
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
                width: "110px",
                height: "140px",
                border: "2px dashed #999",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                color: "#999",
              }}
            >
              Photo
            </div>
          )}
        </div>

        {/* ── TITRE S.S.I.A.P. ── */}
        <div style={{ textAlign: "center", marginTop: "22px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", color: "#1a1a1a" }}>
            DIPLOME D'AGENT
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", color: "#1a1a1a", marginTop: "2px" }}>
            DES SERVICES DE SÉCURITÉ INCENDIE
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", color: "#1a1a1a", marginTop: "2px" }}>
            ET D'ASSISTANCE À PERSONNES
          </div>

          {isSsiap && (
            <div
              style={{
                fontSize: "72px",
                fontWeight: 900,
                letterSpacing: "0.08em",
                color: "#1a1a1a",
                lineHeight: 1.05,
                marginTop: "10px",
                fontFamily: "Georgia, serif",
              }}
            >
              S.S.I.A.P. {ssiapLevel}
            </div>
          )}

          {!isSsiap && (
            <div
              style={{
                fontSize: "38px",
                fontWeight: 900,
                letterSpacing: "0.06em",
                color: "#1a1a1a",
                lineHeight: 1.1,
                marginTop: "10px",
              }}
            >
              {formation.code}
            </div>
          )}
        </div>

        {/* ── CORPS OFFICIEL ── */}
        <div
          style={{
            marginTop: "30px",
            fontSize: "13.5px",
            lineHeight: 1.65,
            color: "#1a1a1a",
            textAlign: "left",
          }}
        >
          <p>
            Vu le procès-verbal du Jury d'examen en date du{" "}
            <strong>{formatDateLong(document.dateExamen)}</strong> déclarant que
          </p>
          <p style={{ marginTop: "6px" }}>
            <strong>Nom : {apprenant.nom}</strong>
            {"  "}
            <strong>Prénom : {apprenant.prenom}</strong>
          </p>
          <p>
            Né{apprenant.civilite === "Madame" ? "e" : ""} le{" "}
            <strong>{formatDate(apprenant.dateNaissance)}</strong>
            {apprenant.paysNaissance ? `, à ${apprenant.lieuNaissance} (${apprenant.paysNaissance})` : `, à ${apprenant.lieuNaissance}`}
          </p>
          <p style={{ marginTop: "8px" }}>
            a subi avec succès les épreuves exigées pour l'obtention du
          </p>
          <p style={{ marginTop: "6px", fontWeight: 700, textTransform: "uppercase", fontSize: "13px" }}>
            {isSsiap
              ? ssiapLevel === "1"
                ? "DIPLÔME D'AGENT DES SERVICES DE SÉCURITÉ INCENDIE ET D'ASSISTANCE À PERSONNES"
                : ssiapLevel === "2"
                  ? "DIPLÔME DE CHEF D'ÉQUIPE DE SÉCURITÉ INCENDIE ET D'ASSISTANCE À PERSONNES"
                  : "DIPLÔME DE CHEF DE SERVICE DE SÉCURITÉ INCENDIE"
              : `DIPLÔME — ${formation.nom.toUpperCase()}`}
          </p>
          <p style={{ marginTop: "6px" }}>
            tel que défini dans l'arrêté du 02 mai 2005 modifié.
          </p>
        </div>

        {/* ── NUMÉRO DIPLÔME ── */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 900,
              letterSpacing: "0.06em",
              color: "#1a1a1a",
            }}
          >
            Diplôme n° {document.numero}
          </div>
        </div>

        {/* ── LIEU / DATE ── */}
        <div style={{ marginTop: "22px", fontSize: "14px", fontStyle: "italic" }}>
          <strong>Fait à {document.lieu}, le {formatDateLong(document.dateExamen)}.</strong>
        </div>

        {/* ── SIGNATURES ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: "28px",
            gap: "20px",
          }}
        >
          {/* Directeur du Centre */}
          <div style={{ flex: 1, fontSize: "12px" }}>
            <div style={{ fontWeight: 700, marginBottom: "4px" }}>Le Directeur du Centre,</div>
            <div>Nom ; {document.presidentNom}</div>
            <div style={{ marginTop: "4px" }}>Signature :</div>
            <div style={{ marginTop: "6px", borderBottom: "1px solid #555", width: "140px", height: "50px", display: "flex", alignItems: "center" }}>
              <img
                src={signImg}
                alt="signature"
                crossOrigin="anonymous"
                style={{ height: "42px", objectFit: "contain" }}
              />
            </div>
          </div>

          {/* QR code vérification — centré */}
          {qrUrl && (
            <div style={{ textAlign: "center", fontSize: "8px", flexShrink: 0 }}>
              <img src={qrUrl} alt="QR" style={{ width: "72px", height: "72px", display: "block", margin: "0 auto" }} />
              <div style={{ color: "#b91c1c", fontWeight: 700, marginTop: "3px", letterSpacing: "0.05em" }}>
                CERTIFIÉ LEARNIX
              </div>
            </div>
          )}

          {/* Représentant SDIS */}
          <div style={{ flex: 1, fontSize: "12px", textAlign: "right" }}>
            <div style={{ fontWeight: 700, marginBottom: "4px" }}>Le représentant du service d'incendie compétent,</div>
            <div>Nom : {document.representantNom}</div>
            <div>Grade : {document.representantGrade}</div>
            <div style={{ marginTop: "4px" }}>Signature :</div>
            <div style={{ marginTop: "6px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px" }}>
              <img
                src={sdisImg}
                alt="cachet SDIS"
                crossOrigin="anonymous"
                style={{ height: "56px", objectFit: "contain", opacity: 0.92 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ────────── FOOTER LÉGAL ────────── */}
      <div
        style={{
          position: "absolute",
          left: "24px",
          right: "24px",
          bottom: "24px",
          borderTop: "1.5px solid #1a1a1a",
          paddingTop: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "9px",
          color: "#1a1a1a",
          zIndex: 5,
        }}
      >
        <div>
          <div style={{ fontWeight: 700 }}>
            LEARNIX — {settings.centreAdresse}
          </div>
          <div>
            Tél : {settings.centreTel} — E-mail : {settings.centreEmail}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div>Déclaration N° {settings.centreDeclaration}</div>
          <div>Siret : {settings.centreSiret}</div>
        </div>
      </div>
    </div>
  );
}
