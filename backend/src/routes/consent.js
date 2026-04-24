const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// Create new consent form
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const result = await prisma.consentForm.create({
      data: {
        ageGroup: data.ageGroup,
        playerFirstName: data.playerFirstName,
        playerSurname: data.playerSurname,
        playerDob: new Date(data.playerDob),
        playerSex: data.playerSex,

        emergencyContact1: data.emergencyContact1,
        emergencyContact2: data.emergencyContact2,

        postcode: data.postcode,
        houseNumber: data.houseNumber,
        email: data.email,

        medicalInfo: data.medicalInfo,
        allergies: data.allergies,

        photoUrl: data.photoUrl || null,

        consentData: data.consentData,
        consentPhotos: data.consentPhotos,
        consentVideos: data.consentVideos,

        parentSignature: data.parentSignature,
        parentName: data.parentName,
        signatureDate: new Date(data.signatureDate),
      },
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save consent form" });
  }
});

router.get("/", async (req, res) => {
  try {
    const forms = await prisma.consentForm.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch forms" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { ageGroup, playerSex } = req.query;

    const forms = await prisma.consentForm.findMany({
      where: {
        ageGroup: ageGroup || undefined,
        playerSex: playerSex || undefined,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch forms" });
  }
});

module.exports = router;
