export type Locale = 'id' | 'en';

export const translations = {
  id: {
    // Home Page
    home: {
      features: 'Fitur',
      howItWorks: 'Cara Kerja',
      getStarted: 'Mulai Sekarang',
      signIn: 'Masuk',
      personalizedNutrition: 'Rencana Gizi yang Dipersonalisasi',
      yourPathToBetterHealth: 'Jalan Pribadi Anda Menuju',
      betterHealth: 'Kesehatan Lebih Baik',
      heroDescription: 'RE FIT menerjemahkan data biometrik Anda menjadi rencana makan yang dapat ditindaklanjuti dan relevan secara budaya. Mulai perjalanan Anda menuju kesehatan yang lebih baik dengan rekomendasi gizi yang dipersonalisasi.',
      startYourJourney: 'Mulai Perjalanan Anda',
      whyChooseRefit: 'Mengapa Memilih RE FIT?',
      whyChooseDescription: 'Kami menggabungkan perhitungan gizi yang didukung sains dengan resep lezat yang relevan secara budaya',
      biometricAnalysis: 'Analisis Biometrik',
      biometricAnalysisDesc: 'Kami menghitung BMR dan TDEE Anda menggunakan persamaan Mifflin-St Jeor untuk target kalori yang tepat',
      smartRecommendations: 'Rekomendasi Cerdas',
      smartRecommendationsDesc: 'Algoritma jarak Euclidean mencocokkan Anda dengan resep yang sesuai dengan profil gizi Anda',
      allergySafe: 'Aman untuk Alergi',
      allergySafeDesc: 'Filter canggih memastikan resep aman untuk batasan diet dan alergi Anda',
      howItWorksTitle: 'Cara Kerja',
      howItWorksDescription: 'Dapatkan rekomendasi resep yang dipersonalisasi dalam tiga langkah mudah',
      step1Title: 'Masukkan Informasi Anda',
      step1Desc: 'Bagikan biometrik, tingkat aktivitas, dan batasan kesehatan Anda',
      step2Title: 'Dapatkan Perhitungan',
      step2Desc: 'Kami menghitung BMR, TDEE, dan target kalori optimal Anda',
      step3Title: 'Temukan Resep',
      step3Desc: 'Terima 9 rekomendasi resep yang dipersonalisasi sesuai dengan Anda',
      readyToTransform: 'Siap untuk Mengubah Gizi Anda?',
      readyToTransformDesc: 'Bergabunglah dengan RE FIT hari ini dan temukan makanan yang sempurna untuk tubuh dan gaya hidup Anda',
      getStartedForFree: 'Mulai Gratis',
      footerText: 'Platform Gizi yang Dipersonalisasi.',
    },
    // Onboarding
    onboarding: {
      title: 'Mari Mengenal Anda',
      description: 'Jawab beberapa pertanyaan sehingga kami dapat mempersonalisasi rencana gizi Anda',
      step: 'Langkah',
      of: 'dari',
      biometrics: 'Biometrik',
      lifestyle: 'Gaya Hidup',
      health: 'Kesehatan',
      foodPreferences: 'Preferensi Makanan',
      previous: 'Sebelumnya',
      next: 'Lanjut',
      getRecommendations: 'Dapatkan Rekomendasi',
      // Step 1 - Biometrics
      gender: 'Jenis Kelamin',
      male: 'Laki-laki',
      female: 'Perempuan',
      age: 'Usia',
      weight: 'Berat Badan',
      height: 'Tinggi Badan',
      // Step 2 - Lifestyle
      activityLevel: 'Tingkat Aktivitas',
      sedentary: 'Sedenter (jarang olahraga)',
      lightlyActive: 'Ringan (olahraga 1-3 hari/minggu)',
      moderatelyActive: 'Sedang (olahraga 3-5 hari/minggu)',
      veryActive: 'Berat (olahraga 6-7 hari/minggu)',
      extraActive: 'Ekstra (olahraga 2x sehari)',
      // Step 3 - Health
      isDiabetic: 'Apakah Anda menderita diabetes?',
      allergies: 'Alergi',
      allergiesDescription: 'Pilih alergi yang Anda miliki',
      // Step 4 - Preferences
      preferredIngredients: 'Bahan Preferensi',
      preferredIngredientsDescription: 'Pilih bahan yang Anda sukai (opsional)',
    },
    // Auth
    auth: {
      createAccount: 'Buat Akun',
      email: 'Email',
      password: 'Kata Sandi',
      confirmPassword: 'Konfirmasi Kata Sandi',
      fullName: 'Nama Lengkap',
      login: 'Masuk',
      logout: 'Keluar',
      signUp: 'Daftar',
      alreadyHaveAccount: 'Sudah punya akun?',
      dontHaveAccount: 'Belum punya akun?',
      signIn: 'Masuk',
      signOut: 'Keluar',
      passwordMismatch: 'Kata sandi tidak cocok',
      passwordTooShort: 'Kata sandi minimal 8 karakter',
      accountCreated: 'Akun berhasil dibuat',
      signInFailed: 'Akun dibuat tetapi masuk gagal. Silakan masuk secara manual.',
      somethingWentWrong: 'Terjadi kesalahan. Silakan coba lagi.',
      userNotFound: 'Pengguna tidak ditemukan',
      invalidCredentials: 'Email atau kata sandi salah',
      termsAgreement: 'Saya setuju dengan',
      termsOfService: 'Syarat Layanan',
      and: 'dan',
      privacyPolicy: 'Kebijakan Privasi',
    },
    // Results & Dashboard
    results: {
      recommendedForYou: 'Direkomendasikan Untuk Anda',
      recipes: 'resep',
      tailoredToYourNeeds: 'resep disesuaikan dengan kebutuhan gizi Anda',
      back: 'Kembali',
      bmr: 'BMR',
      tdee: 'TDEE',
      dailyTarget: 'Target Harian',
      caloriesPerDay: 'kalori/hari',
      wantToTrack: 'Ingin melacak progres Anda?',
      createAccountToTrack: 'Buat akun untuk menyimpan resep favorit, melacak berat badan dari waktu ke waktu, dan mendapatkan rekomendasi yang lebih dipersonalisasi.',
      noRecommendations: 'Belum Ada Rekomendasi',
      noRecommendationsDesc: 'Silakan lengkapi formulir onboarding untuk mendapatkan rekomendasi resep yang dipersonalisasi.',
      startOnboarding: 'Mulai Onboarding',
    },
    // Dashboard
    dashboard: {
      title: 'Dashboard',
      basalMetabolicRate: 'Laju Metabolisme Basal',
      caloriesBurnedAtRest: 'kalori terbakar saat istirahat',
      totalDailyEnergy: 'Pengeluaran Energi Harian Total',
      caloriesBurnedDaily: 'kalori terbakar harian',
      dailyCalorieTarget: 'Target Kalori Harian',
      recommendedIntake: 'asupan yang direkomendasikan',
      weightHistory: 'Riwayat Berat Badan',
      noWeightHistory: 'Belum ada riwayat berat badan. Mulai lacak progres Anda!',
      favoriteRecipes: 'Resep Favorit',
      savedRecipes: 'resep disimpan',
      noFavoriteRecipes: 'Belum ada resep favorit',
      noFavoriteRecipesDesc: 'Simpan resep dari rekomendasi Anda untuk melihatnya di sini',
      yourProfile: 'Profil Anda',
      gender: 'Jenis Kelamin',
      age: 'Usia',
      weight: 'Berat',
      height: 'Tinggi',
      activity: 'Aktivitas',
    },
    // Common
    common: {
      loading: 'Memuat...',
      error: 'Kesalahan',
      success: 'Berhasil',
      cancel: 'Batal',
      save: 'Simpan',
      delete: 'Hapus',
      edit: 'Edit',
      close: 'Tutup',
      menu: 'Menu',
      search: 'Cari',
      filter: 'Filter',
      sort: 'Urutkan',
    },
  },
  en: {
    // Home Page
    home: {
      features: 'Features',
      howItWorks: 'How It Works',
      getStarted: 'Get Started',
      signIn: 'Sign In',
      personalizedNutrition: 'Personalized Nutrition Plans',
      yourPathToBetterHealth: 'Your Personal Path to',
      betterHealth: 'Better Health',
      heroDescription: 'RE FIT translates your biometric data into actionable, culturally relevant meal plans. Start your journey to a healthier you with personalized nutrition recommendations.',
      startYourJourney: 'Start Your Journey',
      whyChooseRefit: 'Why Choose RE FIT?',
      whyChooseDescription: 'We combine science-backed nutrition calculations with delicious, culturally relevant recipes',
      biometricAnalysis: 'Biometric Analysis',
      biometricAnalysisDesc: 'We calculate your BMR and TDEE using the Mifflin-St Jeor equation for precise calorie targets',
      smartRecommendations: 'Smart Recommendations',
      smartRecommendationsDesc: 'Euclidean distance algorithm matches you with recipes that fit your nutritional profile',
      allergySafe: 'Allergy-Safe',
      allergySafeDesc: 'Advanced filtering ensures recipes are safe for your dietary restrictions and allergies',
      howItWorksTitle: 'How It Works',
      howItWorksDescription: 'Get personalized recipe recommendations in three simple steps',
      step1Title: 'Enter Your Info',
      step1Desc: 'Share your biometrics, activity level, and any health constraints',
      step2Title: 'Get Calculations',
      step2Desc: 'We calculate your BMR, TDEE, and optimal calorie target',
      step3Title: 'Discover Recipes',
      step3Desc: 'Receive 9 personalized recipe recommendations tailored to you',
      readyToTransform: 'Ready to Transform Your Nutrition?',
      readyToTransformDesc: 'Join RE FIT today and discover meals that are perfect for your body and lifestyle',
      getStartedForFree: 'Get Started for Free',
      footerText: 'Personalized Nutrition Platform.',
    },
    // Onboarding
    onboarding: {
      title: "Let's Get to Know You",
      description: 'Answer a few questions so we can personalize your nutrition plan',
      step: 'Step',
      of: 'of',
      biometrics: 'Biometrics',
      lifestyle: 'Lifestyle',
      health: 'Health',
      foodPreferences: 'Food Preferences',
      previous: 'Previous',
      next: 'Next',
      getRecommendations: 'Get Recommendations',
      // Step 1 - Biometrics
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      age: 'Age',
      weight: 'Weight',
      height: 'Height',
      // Step 2 - Lifestyle
      activityLevel: 'Activity Level',
      sedentary: 'Sedentary (little or no exercise)',
      lightlyActive: 'Lightly Active (exercise 1-3 days/week)',
      moderatelyActive: 'Moderately Active (exercise 3-5 days/week)',
      veryActive: 'Very Active (exercise 6-7 days/week)',
      extraActive: 'Extra Active (exercise 2x a day)',
      // Step 3 - Health
      isDiabetic: 'Do you have diabetes?',
      allergies: 'Allergies',
      allergiesDescription: 'Select allergies you have',
      // Step 4 - Preferences
      preferredIngredients: 'Preferred Ingredients',
      preferredIngredientsDescription: 'Select ingredients you prefer (optional)',
    },
    // Auth
    auth: {
      createAccount: 'Create an account',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      login: 'Login',
      logout: 'Logout',
      signUp: 'Sign Up',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      signIn: 'Sign In',
      signOut: 'Sign Out',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 8 characters',
      accountCreated: 'Account created successfully',
      signInFailed: 'Account created but sign in failed. Please sign in manually.',
      somethingWentWrong: 'Something went wrong. Please try again.',
      userNotFound: 'User not found',
      invalidCredentials: 'Invalid email or password',
      termsAgreement: 'I agree to the',
      termsOfService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
    },
    // Results & Dashboard
    results: {
      recommendedForYou: 'Recommended For You',
      recipes: 'recipes',
      tailoredToYourNeeds: 'recipes tailored to your nutritional needs',
      back: 'Back',
      bmr: 'BMR',
      tdee: 'TDEE',
      dailyTarget: 'Daily Target',
      caloriesPerDay: 'calories/day',
      wantToTrack: 'Want to track your progress?',
      createAccountToTrack: 'Create an account to save your favorite recipes, track your weight over time, and get even more personalized recommendations.',
      noRecommendations: 'No Recommendations Yet',
      noRecommendationsDesc: 'Please complete the onboarding form to get personalized recipe recommendations.',
      startOnboarding: 'Start Onboarding',
    },
    // Dashboard
    dashboard: {
      title: 'Dashboard',
      basalMetabolicRate: 'Basal Metabolic Rate',
      caloriesBurnedAtRest: 'calories burned at rest',
      totalDailyEnergy: 'Total Daily Energy Expenditure',
      caloriesBurnedDaily: 'calories burned daily',
      dailyCalorieTarget: 'Daily Calorie Target',
      recommendedIntake: 'recommended intake',
      weightHistory: 'Weight History',
      noWeightHistory: 'No weight history yet. Start tracking your progress!',
      favoriteRecipes: 'Favorite Recipes',
      savedRecipes: 'saved recipes',
      noFavoriteRecipes: 'No favorite recipes yet',
      noFavoriteRecipesDesc: 'Save recipes from your recommendations to see them here',
      yourProfile: 'Your Profile',
      gender: 'Gender',
      age: 'Age',
      weight: 'Weight',
      height: 'Height',
      activity: 'Activity',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      menu: 'Menu',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
    },
  },
};

// Helper function to detect user locale
export function detectLocale(acceptLanguage?: string | null): Locale {
  if (!acceptLanguage) {
    return 'id'; // Default to Indonesian
  }

  // Check if the language starts with 'id' (Indonesian)
  if (acceptLanguage.toLowerCase().startsWith('id')) {
    return 'id';
  }

  // Default to English for other languages
  return 'en';
}

// Helper function to get locale from navigator
export function getUserLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'id';
  }
  
  const browserLanguage = navigator.language;
  return detectLocale(browserLanguage);
}

// Helper to get translation
export function getTranslation(locale: Locale) {
  return translations[locale] || translations.en;
}
