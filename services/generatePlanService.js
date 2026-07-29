export const buildPlanFromProfile = (profile) => {
  const weight = Number(profile.weight);
  const heightMeter = Number(profile.height) / 100;
  const bmi = heightMeter > 0 ? weight / (heightMeter * heightMeter) : 0;

  let dailyCaloriesTarget = 2200;
  let summary = "Plan dibuat untuk menjaga pola hidup sehat secara konsisten.";

  if (["cutting", "lose_weight", "menurunkan_berat"].includes(profile.goal_type)) {
    dailyCaloriesTarget = 1800;
    summary = "Fokus plan: defisit kalori ringan, makanan tinggi protein, olahraga rutin, dan tidur cukup.";
  } else if (["bulking", "gain_weight", "menaikkan_berat"].includes(profile.goal_type)) {
    dailyCaloriesTarget = 2800;
    summary = "Fokus plan: surplus kalori terkontrol, latihan kekuatan, dan pemulihan tubuh.";
  } else if (["maintain", "menjaga_berat"].includes(profile.goal_type)) {
    dailyCaloriesTarget = 2200;
    summary = "Fokus plan: menjaga berat badan, makan seimbang, dan aktivitas stabil.";
  }

  if (profile.activity_level === "high") dailyCaloriesTarget += 300;
  if (profile.activity_level === "low") dailyCaloriesTarget -= 200;

  const weeklyBudget = Number(profile.budget_limit || 0);
  const dailyBudget = weeklyBudget > 0 ? Math.round(weeklyBudget / 7) : 0;

  const details = [
    {
      day: "Day 1",
      activity_type: "meal",
      title: "Meal Plan Seimbang",
      description: `Target sekitar ${dailyCaloriesTarget} kkal. Utamakan protein, karbohidrat kompleks, sayur, dan air putih. BMI saat ini sekitar ${bmi.toFixed(1)}.`,
      estimated_cost: dailyBudget
    },
    {
      day: "Day 2",
      activity_type: "workout",
      title: "Workout Ringan",
      description: "Jalan cepat 20-30 menit dan stretching 10 menit.",
      estimated_cost: 0
    },
    {
      day: "Day 3",
      activity_type: "habit",
      title: "Minum Air dan Tidur Cukup",
      description: "Minum air 6-8 gelas dan tidur 7-8 jam.",
      estimated_cost: 0
    },
    {
      day: "Day 4",
      activity_type: "meal",
      title: "Kontrol Porsi Makan",
      description: "Gunakan piring kecil, batasi gula berlebih, dan catat makanan harian.",
      estimated_cost: dailyBudget
    },
    {
      day: "Day 5",
      activity_type: "workout",
      title: "Latihan Kekuatan Dasar",
      description: "Squat, push-up, plank, dan lunges masing-masing 3 set sesuai kemampuan.",
      estimated_cost: 0
    },
    {
      day: "Day 6",
      activity_type: "habit",
      title: "Evaluasi Progress",
      description: "Cek konsistensi makan, olahraga, tidur, dan perubahan berat badan.",
      estimated_cost: 0
    },
    {
      day: "Day 7",
      activity_type: "rest",
      title: "Recovery Day",
      description: "Istirahat aktif, jalan santai, dan persiapan plan minggu berikutnya.",
      estimated_cost: 0
    }
  ];

  return { summary, dailyCaloriesTarget, details };
};
