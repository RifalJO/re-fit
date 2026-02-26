
---

## 🎨 PROMPT REDESIGN UI/UX – RE FIT DASHBOARD

> **Context:**
> Saya memiliki aplikasi nutrisi bernama **RE FIT** dengan fitur: BMR, TDEE, calorie target, intermittent fasting tracker, hydration tracker, macro radar chart, recipe recommendation, favorites, grocery list, dan weight history chart.
> Saya ingin melakukan redesign tampilan agar lebih modern, premium, dan menyenangkan, namun tetap sangat mudah digunakan (user-friendly dan intuitif).

---

### 🎯 Objective

Redesign UI dan UX dashboard agar:

* Lebih clean & modern
* Visual hierarchy lebih jelas
* Tidak terasa penuh / overwhelm
* Mudah dipahami user baru
* Tetap cepat dan ringan
* Mobile-first dan responsive
* Fokus ke usability & clarity

---

### 🧠 UX Improvement Goals

Tolong lakukan perbaikan berikut:

1. **Prioritaskan informasi paling penting di atas (Above the Fold):**

   * Daily Calorie Target
   * Quick progress (Hydration & IF)
   * Weight trend snapshot

2. **Kurangi rasa crowded pada Bento Grid**

   * Buat grouping berdasarkan kategori:

     * 🔥 Daily Tracking
     * 📊 Progress
     * 🍽 Nutrition & Recipes

3. **Buat flow yang lebih natural:**
   Dashboard harus terasa seperti:

   ```
   Summary → Track Today → View Progress → Discover Food
   ```

4. Tambahkan:

   * Empty states yang lebih friendly dan engaging
   * Micro-interactions yang subtle
   * Better spacing & breathing room
   * Card elevation system yang konsisten
   * Hover & active state yang lebih hidup tapi tidak berlebihan

---

### 🎨 Visual Direction

Gunakan konsep desain berikut:

#### Style

* Modern Minimal
* Soft shadows
* 2xl rounded corners
* Subtle gradient accent
* Clean typography
* Calm health-tone color palette (soft green / blue / neutral)

#### Feel

* Light, motivating, not clinical
* Feel like premium health tracker
* Friendly but professional

---

### 🧱 Layout Redesign Suggestion

Tolong ubah struktur menjadi:

---

#### 1️⃣ Smart Summary Section (Sticky Top Area)

Berisi:

* Greeting + user name
* Calorie target highlight card (bigger than others)
* 2 mini progress bars:

  * Water progress
  * Fasting progress
* Mini weight trend sparkline

---

#### 2️⃣ Daily Tracking Section

Cards lebih clean:

* Hydration tracker
* IF tracker
* Quick add weight button (floating action style)

Gunakan:

* Horizontal layout di desktop
* Swipeable card di mobile

---

#### 3️⃣ Progress & Insights Section

* Weight Chart (full width)
* Macro Radar (collapsible)
* Weekly summary insight card:

  * "You're consistent this week"
  * "Water intake improved 12%"

---

#### 4️⃣ Recipe Experience Section

Buat lebih immersive:

* Recommended section dengan horizontal scroll
* Favorites dengan better card hierarchy
* Grocery list jadi expandable panel

---

### 💡 UX Enhancements to Include

Tambahkan:

* Floating Quick Action Button (mobile)

  * * Log Weight
  * * Add Water
* Skeleton loading instead of spinner
* Smart empty states illustration
* Smooth reveal animations (not overdone)
* Better spacing system (8px grid consistency)
* More readable metric formatting (e.g. 2,350 kcal)

---

### 📱 Responsive Requirements

Mobile:

* Single column
* Swipeable tracking widgets
* Sticky bottom quick action

Tablet:

* 2 columns grid

Desktop:

* 3 or 4 columns max
* Jangan terlalu banyak card dalam 1 viewport

---

### 🚨 UX Rules (DO NOT BREAK)

* Jangan menampilkan terlalu banyak chart di atas
* Jangan membuat user scroll terlalu jauh untuk info penting
* Jangan gunakan warna terlalu kontras
* Jangan over-animate
* Jangan membuat grid terasa berat dan padat

---

### 📊 Deliverables I Want

Tolong berikan:

1. Layout wireframe explanation
2. Visual system recommendation (spacing, radius, shadows)
3. UX improvement list (before vs after)
4. Component restructuring suggestion
5. Mobile optimization strategy
6. Design system token recommendation

---

### 🪄 Output Style

Berikan output dalam bentuk:

* Structured breakdown
* Clean sections
* No fluff
* Concrete actionable suggestions
* Jika perlu berikan contoh class Tailwind

---
