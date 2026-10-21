# ajk.gov.pk: review of the current site and the proposed redesign

Reviewed on 21 October 2026.

## 1. Serious problems on the current site

| # | Problem found | Evidence | Fixed in the redesign |
| --- | --- | --- | --- |
| 1 | **The site has been compromised with hidden spam.** Hidden text and links advertising fake Rolex watches are injected into the home page. Similar hidden spam (wigs, hats, clothes, mobile phones) appears on the Kashmir Conflict, AJK Map and News pages. This damages the government's reputation and its search ranking, and shows that someone has write access to the site. | Hidden `<h1>` placed far off-screen with a link to a replica watch shop; hidden paragraphs on other pages | All spam removed. New code base with no WordPress plugins. A strict Content Security Policy blocks injected scripts. All admin changes are logged |
| 2 | "About AJK" and "Departments" menu items link to `#` (they go nowhere when clicked) | Menu HTML | Real About page and a searchable Department directory, plus dropdown menus |
| 3 | The "Kashmir at a glance" photos are swapped: the Education card shows a dam and the Hydro Power card shows a computer lab | Image files on the home page | Correct photo on each card |
| 4 | The "AJK Video Updates" section uses old static images with a YouTube link behind them. One of the three linked videos has been deleted from YouTube | YouTube returns 404 for video `trTtQs5srog` | Admins paste any YouTube link; the real thumbnail is fetched automatically and the video plays in a pop-up. Dead video removed |
| 5 | The flag video (a GIF) in the intro block looks low quality | Home page | Removed. Replaced with a full-width hero with real photos of Muzaffarabad |
| 6 | Two news photos are broken (files missing on the server) | 404 for the 12 August 2024 cabinet story and 11 March 2024 Shah Sultan bridge story | Clean fallback image instead of a broken image |
| 7 | The Fuel Subsidy news story has no text at all | Empty post body | Short summary added (to be confirmed by DGPR) |
| 8 | Several department links use insecure `http://` | Menu links (PSC, EC, HED, DGPR, BOI, C&W, SIC, Jobs) | Kept as they are (those sites need HTTPS themselves); listed here for the IT Board |
| 9 | No search, no contact form, no way for citizens to send feedback | Whole site | Site search (news, pages, departments, helplines) and a contact form with spam protection; messages arrive in the admin panel |
| 10 | Helplines page is one long table with several empty numbers | Helplines page | Tabs, search, tap-to-call on phones, and "Number not listed" instead of empty cells |
| 12 | Three links on the current site point to domains that no longer exist: presidentajk.gov.pk, information.ajk.gov.pk and health.ajk.gov.pk | DNS lookup fails for all three | Health now links to healthajk.gok.pk, Information to the DGPR site (pid.ajk.gov.pk); the President link is hidden until a working address is confirmed |
| 11 | Old WordPress plugins, jQuery and many scripts slow the site down | Page source | Modern Next.js site, optimised images, much less JavaScript |

## 2. Corrections to content

| Where | Was | Now | Why |
| --- | --- | --- | --- |
| Kashmir Conflict | UNCIP resolution of "3 August 1948" | 13 August 1948 | The UNCIP resolution is dated 13 August 1948 |
| Kashmir Conflict | "The ceasefire line is called the Line of Control" (1949) | The ceasefire line was renamed the Line of Control under the Simla Agreement of 1972 | It was the Ceasefire Line until 1972 |
| Kashmir Conflict | "Rambir Singh", "Mahraja", "Marajas", "governing principal" | Ranbir Singh, Maharaja, Maharajas, governing principle | Spelling |
| Kashmir Conflict | Muslim Conference "formed by Sheikh Abdullah" | Sheikh Abdullah and Chaudhry Ghulam Abbas | Both founded it in 1932 |
| Kashmir Conflict | "Indian-Held Kashmir" | Indian Illegally Occupied Jammu & Kashmir (IIOJK) | Official terminology of the Government of Pakistan and AJK |
| Kashmir Conflict | "0.2% turn out during the 1989 elections" | "very low turnout in the 1989 elections" | The exact figure could not be verified; please confirm with the Liberation Cell |
| AJK Overview | "enjoys semi-autonomous status within Pakistan" | A self-governing state whose final status is to be decided by the people through the UN plebiscite | Matches the State's legal position under the UN resolutions and the Interim Constitution |
| Hydro Power | "Mangla Dam ... is the world's largest dam" | "one of the largest dams in the world" | Mangla is not the world's largest dam |
| Hydro Power | "could meet Pakistan's power needs" | "would make a major contribution to Pakistan's energy needs" | Overstated claim |
| Intro | "self-governing state, It has ... Kashmir Council and Supreme / High court" | Grammar fixed | Grammar |
| Tourism | "comitted", "south asia" | committed, South Asia | Spelling |
| Departments | "Election Commison", "Archeology" | Election Commission, Archaeology | Spelling |
| Helplines | Medical college numbers had the Mirpur and Rawalakot area codes swapped | Mirpur 05827, Rawalakot 05824 | Area codes; please confirm the numbers |
| Helplines | "Pakistan Red Cross", "Thrarkhal", "Kahutta" | Pakistan Red Crescent, Trarkhal, Kahuta | Names |
| President / PM text | "Iftikhar Gillani" and "Syed Iftikhar Gillani" both used | Syed Iftikhar Gillani | Consistency |

**To verify before launch:** the 20,000 MW hydropower potential figure (ask PDO), the advisor's name "Shabeer Ahmed Usman" (title) vs "Usmani" (body) in the 1 October 2026 story, and the official contact phone and email (left empty).

## 3. What is new

- **Identity of the State:** the home page now presents AJK as the base camp of the freedom struggle: a Kashmir cause band with the UN Security Council Resolution 47 quote, years on the UN agenda, the days of remembrance (5 February, 13 July, 19 July, 5 August, 24 October, 27 October) with the next one highlighted, and a history timeline from the Treaty of Amritsar (1846) to 5 August 2019.
- **Urdu name** of the State in Nastaliq script, the state seal, and a chinar leaf as the site icon and design motif.
- **Admin panel** where staff can add, edit, reorder, upload and delete every piece of content: news, videos, pages, hero photos, leadership, campaign banners, sectors, key figures, timeline, days, departments, helplines, site settings and media files.
- **Mobile-first**, accessible (keyboard navigation, skip link, alt text, reduced motion), fast.
- Old address `/kashmir-conflict` redirects to the new `/kashmir-cause`.
