# Version 1 (27-10-2025)

- Added Surah Endpoints

  - Get all surahs info

        - /

  - Get specific surah info including ayat

        - /:surahnumber

- Added Ayah Endpoint

  - Get info of specific ayah from surah

        - /:surahnumber/:ayahnumber

- Added Juz, Hizb, Pages Endpoints

  - Get info for Juz, hizb, pages

        - /juz, /hizb, /pages

  - Get info for specific Juz, hizb, pages

        - /juz/:juznumber, /hizb/:hizbnumber, /pages/:pagenumber

- Added Tafseer Endpoints

  - Get all surah ayat tafseer

        - /tafseer/:surahnumber

  - Get specific ayah tafseer from surah

        - /tafseer/:surahnumber/:ayahnumber
