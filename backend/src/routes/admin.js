const express = require("express");
const { createObjectCsvStringifier } = require("csv-writer");
const prisma = require("../prisma");

const router = express.Router();

function isDevelopmentAge(ageGroup) {
  const age = Number(String(ageGroup).replace("u", ""));
  return age <= 11;
}

router.get("/dashboard", async (req, res) => {
  try {
    const forms = await prisma.consentForm.findMany();

    const total = forms.length;
    const boys = forms.filter((f) => f.playerSex === "Male").length;
    const girls = forms.filter((f) => f.playerSex === "Female").length;
    const development = forms.filter((f) => isDevelopmentAge(f.ageGroup)).length;
    const competitive = forms.filter((f) => !isDevelopmentAge(f.ageGroup)).length;

    res.json({ total, boys, girls, development, competitive });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

router.get("/registrations", async (req, res) => {
  try {
    const { ageGroup, playerSex } = req.query;

    const registrations = await prisma.consentForm.findMany({
      where: {
        ageGroup: ageGroup || undefined,
        playerSex: playerSex || undefined,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load registrations" });
  }
});

router.delete("/registrations/:id", async (req, res) => {
  try {
    await prisma.consentForm.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete registration" });
  }
});

router.get("/registrations.csv", async (req, res) => {
  try {
    const forms = await prisma.consentForm.findMany({
      orderBy: { createdAt: "desc" },
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "createdAt", title: "Created At" },
        { id: "ageGroup", title: "Age Group" },
        { id: "playerFirstName", title: "Player First Name" },
        { id: "playerSurname", title: "Player Surname" },
        { id: "playerDob", title: "Player DOB" },
        { id: "playerSex", title: "Sex" },
        { id: "email", title: "Email" },
        { id: "postcode", title: "Postcode" },
        { id: "houseNumber", title: "House Number" },
        { id: "medicalInfo", title: "Medical Info" },
        { id: "allergies", title: "Allergies" },
        { id: "consentData", title: "Contact Consent" },
        { id: "consentPhotos", title: "Photo Consent" },
        { id: "consentVideos", title: "Video Consent" },
        { id: "parentName", title: "Parent Name" },
        { id: "signatureDate", title: "Signature Date" },
      ],
    });

    const csv =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(forms);

    res.header("Content-Type", "text/csv");
    res.attachment("wwfc-registrations.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export CSV" });
  }
});

module.exports = router;