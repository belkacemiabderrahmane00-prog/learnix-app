import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { formatDate, formatDateLong } from "@/lib/date-utils";
import type { Apprenant, DocumentGenere, Formation, Settings } from "@/lib/types";

interface Props {
  apprenant: Apprenant;
  formation: Formation;
  document: DocumentGenere;
  settings: Settings;
}

/**
 * Diplôme CQP / TFP APS — reproduction fidèle du template RAKIB PDF.
 * Dimensions : 1123 x 794 px (A4 paysage @ 96 dpi).
 * Certifié par IESC Formation, émis par LEARNIX centre de formation.
 */
export function CqpApsDiploma({ apprenant, formation, document, settings }: Props) {
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    const verifyUrl = `${settings.verificationBaseUrl}/verification/${document.numero}`;
    QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 100,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    }).then(setQrUrl);
  }, [document.numero, settings.verificationBaseUrl]);

  const civilite = apprenant.civilite ?? "Monsieur";
  const pays = apprenant.paysNaissance ? ` (${apprenant.paysNaissance})` : "";

  return (
    <div
      id="diploma-render"
      style={{
        width: "1123px",
        height: "794px",
        position: "relative",
        background: "#ffffff",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        color: "#1a1a2e",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ── FOND : vagues décoratives SVG ── */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
        viewBox="0 0 1123 794"
        preserveAspectRatio="none"
      >
        <path d="M0,200 Q281,100 562,200 T1123,200" stroke="#e8eaf6" strokeWidth="1.5" fill="none" opacity="0.8" />
        <path d="M0,240 Q281,140 562,240 T1123,240" stroke="#e8eaf6" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M0,280 Q281,180 562,280 T1123,280" stroke="#e8eaf6" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M0,320 Q281,220 562,320 T1123,320" stroke="#e8eaf6" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M0,360 Q281,260 562,360 T1123,360" stroke="#e8eaf6" strokeWidth="0.8" fill="none" opacity="0.35" />
        <path d="M0,400 Q281,300 562,400 T1123,400" stroke="#e8eaf6" strokeWidth="0.7" fill="none" opacity="0.3" />
        <path d="M0,440 Q281,340 562,440 T1123,440" stroke="#e8eaf6" strokeWidth="0.7" fill="none" opacity="0.25" />
        <path d="M0,160 Q281,60 562,160 T1123,160" stroke="#e8eaf6" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M0,120 Q281,20 562,120 T1123,120" stroke="#e8eaf6" strokeWidth="0.8" fill="none" opacity="0.4" />
      </svg>

      {/* ────────── LOGO TFP APS (haut gauche) ────────── */}
      <div style={{ position: "absolute", top: "26px", left: "28px", zIndex: 5 }}>
        {/* Badge circulaire TFP APS */}
        <svg width="110" height="110" viewBox="0 0 110 110">
          {/* Cercle de fond bleu marine */}
          <circle cx="55" cy="55" r="52" fill="#1a2a6c" />
          {/* Anneau intérieur plus clair */}
          <circle cx="55" cy="55" r="46" fill="none" stroke="#2d4a9e" strokeWidth="2" />
          {/* Étoiles en cercle (style EU/certification) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const r = 38;
            const cx = 55 + r * Math.cos(angle);
            const cy = 55 + r * Math.sin(angle);
            return (
              <polygon
                key={i}
                points="0,-5 1.5,-1.5 5,-1.5 2.5,1 3.5,5 0,2.5 -3.5,5 -2.5,1 -5,-1.5 -1.5,-1.5"
                fill="#f5c518"
                transform={`translate(${cx},${cy})`}
              />
            );
          })}
          {/* Texte TFP */}
          <text x="55" y="45" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="1">TFP APS</text>
          {/* Ligne séparatrice */}
          <line x1="25" y1="50" x2="85" y2="50" stroke="#f5c518" strokeWidth="1" />
          {/* Sous-titre */}
          <text x="55" y="62" textAnchor="middle" fill="#c8d4f0" fontSize="5.5" fontFamily="Arial, sans-serif" letterSpacing="0.5">Titre à Finalité</text>
          <text x="55" y="70" textAnchor="middle" fill="#c8d4f0" fontSize="5.5" fontFamily="Arial, sans-serif" letterSpacing="0.5">Professionnelle</text>
        </svg>

        {/* Logo IESC Formation en-dessous */}
        <div style={{ marginTop: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {/* Icône étoile IESC */}
            <svg width="28" height="28" viewBox="0 0 28 28">
              <polygon points="14,2 17,10 26,10 19,15 22,24 14,19 6,24 9,15 2,10 11,10" fill="#1a2a6c" />
            </svg>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2a6c", fontFamily: "'Georgia', serif", lineHeight: 1 }}>
                IESC<span style={{ fontStyle: "italic", fontWeight: 400, marginLeft: "2px" }}>Formation</span>
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: "7px",
              color: "#555",
              letterSpacing: "0.08em",
              marginTop: "2px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            EXPERT EN SÉCURITÉ PRIVÉE
          </div>
        </div>
      </div>

      {/* ────────── TITRE PRINCIPAL (centre haut) ────────── */}
      <div
        style={{
          position: "absolute",
          top: "38px",
          left: "160px",
          right: "200px",
          textAlign: "center",
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontSize: "30px",
            fontWeight: 700,
            color: "#1a2a6c",
            lineHeight: 1.2,
            fontFamily: "Georgia, serif",
          }}
        >
          Titre à Finalité Professionnelle
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#1a2a6c",
            marginTop: "4px",
            lineHeight: 1.2,
          }}
        >
          Agent de Prévention et de Sécurité
        </div>
      </div>

      {/* ────────── PHOTO candidat (haut droite) ────────── */}
      <div
        style={{
          position: "absolute",
          top: "28px",
          right: "30px",
          width: "110px",
          height: "140px",
          border: "2px solid #1a2a6c",
          background: "#eee",
          overflow: "hidden",
          zIndex: 5,
        }}
      >
        {apprenant.photo ? (
          <img
            src={apprenant.photo}
            alt="photo candidat"
            crossOrigin="anonymous"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#999" }}>
            Photo
          </div>
        )}
      </div>

      {/* ────────── CORPS CENTRAL ────────── */}
      <div
        style={{
          position: "absolute",
          top: "185px",
          left: "40px",
          right: "40px",
          zIndex: 5,
        }}
      >
        {/* Nom du candidat */}
        <div
          style={{
            textAlign: "center",
            fontSize: "26px",
            fontWeight: 700,
            color: "#1a2a6c",
            letterSpacing: "0.02em",
          }}
        >
          {civilite} {apprenant.nom} {apprenant.prenom}
        </div>

        {/* Date et lieu de naissance */}
        <div
          style={{
            textAlign: "center",
            fontSize: "13.5px",
            color: "#333",
            marginTop: "6px",
          }}
        >
          né{apprenant.civilite === "Madame" ? "e" : ""}(e) le {formatDate(apprenant.dateNaissance)} à {apprenant.lieuNaissance}{pays}
        </div>

        {/* Procès-verbal */}
        <div
          style={{
            textAlign: "center",
            fontSize: "13.5px",
            color: "#1a1a1a",
            marginTop: "18px",
            lineHeight: 1.6,
          }}
        >
          <div>
            Procès-verbal du jury d'examen en date du{" "}
            <strong style={{ color: "#1a2a6c" }}>{formatDateLong(document.dateExamen)}</strong>
          </div>
          <div>
            à la suite de la formation Titre Agent de Prévention et de Sécurité
            {document.dateDebutFormation && document.dateFinFormation ? (
              <>
                {" "}du{" "}
                <strong style={{ color: "#1a2a6c" }}>{formatDateLong(document.dateDebutFormation)}</strong>
                {" "}au{" "}
                <strong style={{ color: "#1a2a6c" }}>{formatDateLong(document.dateFinFormation)}</strong>
                .
              </>
            ) : "."}
          </div>
        </div>

        {/* Ligne RNCP */}
        {(formation.rncp || formation.niveauRncp) && (
          <div
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: "#444",
              marginTop: "12px",
              letterSpacing: "0.01em",
            }}
          >
            {formation.rncp && `Enregistrement ${formation.rncp}`}
            {formation.niveauRncp && ` - ${formation.niveauRncp}`}
            {formation.codeNsf && ` - code NSF ${formation.codeNsf}`}
            {" – Enregistrement auprès de France Compétences le 23 novembre 2022"}
          </div>
        )}

        {/* Numéros diplôme et CNAPS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "18px",
            fontSize: "12px",
            color: "#1a1a1a",
          }}
        >
          <div>
            Diplôme n°{" "}
            <strong style={{ fontSize: "14px", color: "#1a2a6c" }}>{document.numero}</strong>
          </div>
          {document.cnapsNumero && (
            <div>
              CNAPS n°{" "}
              <strong style={{ fontSize: "13px", color: "#1a2a6c" }}>{document.cnapsNumero}</strong>
            </div>
          )}
        </div>
      </div>

      {/* ────────── BAS DU DOCUMENT : 3 colonnes ────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "60px",
          left: "30px",
          right: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 5,
        }}
      >
        {/* Colonne gauche : Date */}
        <div style={{ width: "200px" }}>
          <div style={{ fontSize: "13px", color: "#1a1a1a", fontStyle: "italic" }}>
            {document.lieu} le, {formatDateLong(document.dateObtention)}
          </div>
          <div style={{ marginTop: "8px", borderBottom: "1.5px solid #1a2a6c", width: "80px" }} />
          <div
            style={{
              marginTop: "4px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#b91c1c",
              letterSpacing: "0.05em",
            }}
          >
            Date
          </div>
        </div>

        {/* Colonne centre : Centre de Formation */}
        <div style={{ width: "280px", textAlign: "center" }}>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 900,
              color: "#1a1a1a",
              letterSpacing: "0.1em",
            }}
          >
            {settings.centreNom}
          </div>
          {settings.centreForCode && (
            <div style={{ fontSize: "9px", color: "#444", marginTop: "3px" }}>
              {settings.centreForCode}
            </div>
          )}
          {settings.centreQualiopi && (
            <div style={{ fontSize: "9px", color: "#444", marginTop: "2px" }}>
              {settings.centreQualiopi}
            </div>
          )}
          {settings.centreAps && (
            <div style={{ fontSize: "9px", color: "#444", marginTop: "2px" }}>
              {settings.centreAps}
            </div>
          )}
          <div style={{ marginTop: "10px", borderBottom: "1.5px solid #1a2a6c", width: "100px", margin: "10px auto 0" }} />
          <div
            style={{
              marginTop: "4px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#b91c1c",
              letterSpacing: "0.05em",
            }}
          >
            Centre de Formation
          </div>
        </div>

        {/* Colonne droite : Certificateur */}
        <div style={{ width: "220px", textAlign: "center" }}>
          {/* Nom du certificateur */}
          {formation.certificateurRepresentant && (
            <div
              style={{
                fontSize: "16px",
                fontStyle: "italic",
                color: "#1a2a6c",
                fontFamily: "Georgia, serif",
              }}
            >
              {formation.certificateurRepresentant}
            </div>
          )}

          {/* Badge TFP APS miniature */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "4px" }}>
            <svg width="42" height="42" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="20" fill="#1a2a6c" />
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 45 - 90) * (Math.PI / 180);
                const r2 = 14;
                const cx2 = 21 + r2 * Math.cos(angle);
                const cy2 = 21 + r2 * Math.sin(angle);
                return (
                  <polygon
                    key={i}
                    points="0,-3 1,-1 3,-1 1.5,0.5 2,3 0,1.5 -2,3 -1.5,0.5 -3,-1 -1,-1"
                    fill="#f5c518"
                    transform={`translate(${cx2},${cy2})`}
                  />
                );
              })}
              <text x="21" y="22" textAnchor="middle" fill="white" fontSize="5" fontWeight="900" fontFamily="Arial" dy="1">TFP APS</text>
            </svg>
            {qrUrl && (
              <img src={qrUrl} alt="QR" style={{ width: "44px", height: "44px" }} />
            )}
          </div>

          <div style={{ marginTop: "6px", borderBottom: "1.5px solid #1a2a6c", width: "100px", margin: "6px auto 0" }} />
          <div style={{ marginTop: "4px", fontSize: "11px", color: "#555" }}>Le Certificateur</div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#1a2a6c",
            }}
          >
            {formation.certificateurNom ?? "IESC Formation"}
          </div>
        </div>
      </div>

      {/* ────────── FOOTER IESC / LEARNIX ────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          height: "50px",
          background: "#f0f4ff",
          borderTop: "2px solid #1a2a6c",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          zIndex: 10,
        }}
      >
        {/* Gauche : logo IESC petit */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="22" height="22" viewBox="0 0 28 28">
            <polygon points="14,2 17,10 26,10 19,15 22,24 14,19 6,24 9,15 2,10 11,10" fill="#1a2a6c" />
          </svg>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#1a2a6c" }}>
              IESC<span style={{ fontStyle: "italic", fontWeight: 400 }}>Formation</span>
            </div>
            <div style={{ fontSize: "7px", color: "#666", letterSpacing: "0.06em" }}>EXPERT EN SÉCURITÉ PRIVÉE</div>
          </div>
        </div>

        {/* Droite : coordonnées */}
        <div style={{ fontSize: "8px", color: "#444", textAlign: "right", lineHeight: 1.4 }}>
          <div>IESC Formation – 35 bis rue Georges Wodli – 57300 Hagondange • www.iesc.fr • iesc@iesc.fr</div>
          <div>Déclaration d'activité n°41 57 02 357 • Autorisation CNAPS n°FOR-057-2027-02-24-20220582099</div>
        </div>
      </div>
    </div>
  );
}
