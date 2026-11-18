/* =====================================================================
   ENDOPIMA v1.2 — APPLICATION CORE
   ---------------------------------------------------------------------
   ARCHITECTURE NOTES (single-file prototype, replaceable later):
   - I18N      : EN/SW dictionary + L() inline helper
   - Store     : safe localStorage adapter (falls back to memory if
                 storage is unavailable, e.g. sandboxed previews)
   - Models    : documented conceptual data shapes (see MODEL DOC below)
   - DemoData  : THE single centralised fictional dataset. All charts and
                 demo numbers MUST read from here, so the whole layer can
                 be swapped for a real API later. DO NOT scatter fake
                 numbers through the UI.
   - API       : mock service layer exposing async-like interfaces that a
                 future backend would implement (screeningService,
                 passportStore, referralService, observatoryService...)
   - UI        : section router + per-section renderers (all re-runnable
                 on language switch = full bilingual coverage)
   ===================================================================== */

/* ---------- MODEL DOC (conceptual shapes for a future backend) --------
   User                   { id, lang, createdAt }
   Consent                { navigation:bool, research:bool, followup:bool,
                            researchOpted:bool|null, updatedAt }
   Screening              { id, date, context('self'|'chp'|'village'),
                            answers{}, score, band, redFlags[], contributors[] }
   SymptomRecord          { id, type, severity, notes }
   EndoPassport           { userId, timeline[{age,text}], symptoms[],
                            impact[], care[{facility,date,referral,treatment,
                            response}], investigations[{type,note}] }
   Referral               { id, from, to, reason, priority, status }
   Appointment            { id, date, type, place, status }
   CareJourney            { stage: 'pima'|'thibiti'|'fanya'|'followup', steps[] }
   FollowUp               { date, answers{}, navFlags[] }
   CostPlan               { goal, current, monthly, selected[] }
   ResearchContribution   { opted:bool, withdrewAt:null|Date }
   AggregatedRegistryRecord{ county, ageGroup, band, referralStatus,
                            careStage, followUpStatus, reportedSymptomDuration,
                            schoolWorkImpact }   // ALL FICTIONAL IN DEMO
   CHPProfile             { id, county, village, households[] }
---------------------------------------------------------------------- */

/* ---------- I18N ---------- */
const T = {
  sw: {
    "skip":"Ruka hadi maudhui",
    "banner.b1":"Mfano wa mfumo (prototype v1.2) — elimu na uelekezaji wa huduma.",
    "banner.b2":"Si kifaa cha matibabu. Hakuna muunganisho halisi wa USSD, eCHIS, SHA, M-Pesa au kliniki. Kila takwimu inaonyesha chanzo chake; takwimu za mfano zimetiwa alama wazi.",
    "tagline":"Kupima Mapema",
    
    
    
    "hero.h1a":"Maumivu yako ni halisi.","hero.h1b":"Maumivu makali ya mwezi si kitu unachopaswa tu kuvumilia.",
    "hero.p":"Maumivu makali ya mwezi hayapaswi kupuuzwa. Kama maumivu ya mwezi yanakufanya ukose shule au kazi, kukuzuia kulala, kuathiri mahusiano yako, au kufanya maisha ya kila siku yawe magumu — unastahili kusikilizwa. EndoPima hukusaidia kuelewa unachopitia, kuweka hadithi yako ya afya pamoja, na kujiandaa kwa hatua inayofuata.",
    "hero.soothe":"Hii ni nafasi tulivu na ya faragha. Chukua muda wako — hakuna kitu cha kutisha hapa, na hakuna kinachoshirikiwa bila ridhaa yako.",
    "hero.cta2":"Hifadhi hadithi yangu","hero.cta3":"Tafuta hatua yangu inayofuata","home.expRec":"Ukipata ukisoma hii na kufikiri, <i>&ldquo;Hivi ndivyo nilivyokuwa nikipitia&rdquo;</i> — ndiyo sababu hasa ya nafasi hii.","home.bridgeH":"Si lazima ujue kila kitu mara moja.","home.bridgeP":"Anza kwa kutueleza ulichokuwa ukipitia. Kisha hatua kwa hatua, tunaweza kuangalia pamoja kile kinachoweza kusaidia.","home.bridgeBtn":"Angalia dalili zangu","home.bridgeNote":"Karibu dakika 3 · faragha, kinabaki kwenye kifaa hiki","pass.jT":"Safari hii:","pass.j1":"Dalili","pass.j2":"Muda","pass.j3":"Huduma za awali","pass.j4":"Uchunguzi","pass.j5":"Maswali","pass.j6":"Muhtasari wa daktari","obs.future":"Takwimu za mfano — si makadirio ya kitaifa ya ugonjwa. Hili ni wazo kwa watafiti na watunga sera, si sehemu ya safari ya mwanamke.","fanya.seqH":"Inaendana wapi na safari yako:","fanya.seq1":"Kinachotokea?","fanya.seq2":"Nifanye nini?","fanya.seq3":"Nijiandae vipi?","fanya.seq4":"Nidhibiti gharama vipi?","jamii.sub2":"(Haya ni mawazo ya mfumo mzima — huhitaji yoyote kati yao kutumia EndoPima kwa ajili yako mwenyewe.)",
    
    "hero.s1":"wanawake duniani wana endometriosis (makadirio ya WHO)","hero.s2":"kuchelewa kugunduliwa katika tafiti za nchi nyingi; data ya Kenya ni finyu",
    "hero.s3":"Wasaidizi wa Afya wa Jamii wanaofanya kazi Kenya (107,000 — Wizara ya Afya, 2024)","hero.s4":"ya vijana wa Kenya waliohojiwa hawajawahi kusikia kuhusu ugonjwa huu (utafiti wa EAMJ 2018 — vijana 313, shule 2)",
    
    "home.st1t":"Tambua","home.st1h":"PIMA","home.st1p":"Uchunguzi wa dalili kwa simu mahiri, mtindo wa USSD, au na Msaidizi wa Afya wa Jamii. Hutoa kiashiria cha kipaumbele — si utambuzi.",
    "home.st2t":"Elekea","home.st2h":"THIBITI","home.st2p":"Mwelekeo wa hatua inayofuata: wapi kwenda, nini kuuliza, nini kubeba. Tathmini ya kimatibabu na picha sahihi huja kwanza — si upasuaji kwa kila mtu.",
    "home.st3t":"Fadhili","home.st3h":"FANYA","home.st3p":"Elewa gharama halisi, panga akiba, pitia SHA inapohitajika, ukiwa na Dada Navigator kando yako.",
    "home.st4t":"Thibitisha","home.st4h":"THIBITISHA","home.st4p":"Kwa ridhaa, safari zisizo na majina zinakua Observatory — ushahidi ambao watunga sera wa Kenya bado hawana.",
    "home.fly":"Gurudumu la EndoPima (flywheel)","home.core":"Kanuni tunayojenga kwayo",
    "home.core2":"Si PIMA → alama imeuzwa. Alama ni mwanzo tu.","home.core3":"Hatutambui ugonjwa kupitia app.",
    "home.core4":"Tunasaidia wanawake kutambua dalili, kufika kwenye huduma, na kuweka hadithi yao pamoja.",
    "home.core5":"Na wakichagua, tunasaidia kujenga ushahidi ambao Kenya inahitaji.",
    "home.myths":"Hadithi & ukweli — kwa uangalifu","home.mythsSub":"Majibu rahisi, kwa weledi wa ushahidi.",
    "hm.m1":"\"Maumivu makali ya mwezi ni ya kawaida kila mara.\"","hm.m1p":"UKWELI: Maumivu ya mwezi ni ya kawaida kwa wengine, lakini maumivu makali au yanayovuruga maisha yanastahili kuangaliwa.",
    "hm.m2":"\"Endometriosis huathiri matajiri tu.\"","hm.m2p":"UKWELI: Endometriosis inaweza kumathiri mwanamke yeyote. Nchini Kenya hadithi hii imechelewesha utambuzi.",
    "hm.m3":"\"Kupata mtoto hutibu endometriosis.\"","hm.m3p":"UKWELI: Ujauzito si tiba ya endometriosis. Dalili zinaweza kubadilika lakini ugonjwa hubaki.",
    "hm.m4":"\"Ultrasound isiyo na tatizo daima huondoa endometriosis.\"","hm.m4p":"UKWELI: Picha zina mipaka yake. Daktari ndiye anayeamua uchunguzi unaofaa.",
    "hm.m5":"\"Endometriosis ni adimu kwa wanawake wa Afrika.\"","hm.m5p":"UKWELI: Imani hii inatokana na ukosefu wa utafiti na ufikiaji, si ukosefu wa ugonjwa — na imesababisha ucheleweshaji mkubwa.",
    "hm.m6":"\"Ni cramps tu — jifunze kuishi nazo.\"","hm.m6p":"UKWELI: Maumivu yanayokufanya ukose shule, kazi au usingizi ni ishara ya kuangaliwa, si nguvu ya kuvumilia.",
    "home.why":"Kwanini Kenya, kwanini sasa — kwa uaminifu",
    "home.whyP":"Endometriosis huathiri wanawake duniani kote. Ushahidi wa Kenya bado ni finyu, ufikiaji wa huduma hauko sawa, uelewa ni changamoto — na Kenya ina rasilimali kubwa ambazo hazijatumika vya kutosha: wafanyakazi wa afya ya jamii wanaolipwa, miundombinu ya afya ya kidijitali inayokua, na mashirika na madaktari waliopo tayari wakihudumia wagonjwa.",
    "home.whyP2":"EndoPima inajitaja kama <b>miundombinu inayoweza kuunganisha na kuimarisha mfumo uliopo</b> — si mbadala wa mashirika yaliyopo tayari kufanya kazi hii.",
    "home.whyP3":"Hakuna ushirikiano unaodaiwa. Orodha hapa ni \"washirika watarajiwa\".",
    "home.assets":"Rasilimali za Kenya mfumo huu unazingatia kuzitumia",
    "home.a1":"<b>Wasaidizi 107,000+</b> wenye kidijitali ya eCHIS — nguvu kazi ya mwanzo.",
    "home.a2":"<b>M-Pesa na simu mahiri ~42M</b> — njia za ufikiaji na fedha.",
    "home.a3":"<b>SHA</b> inaweza kulipia baadhi ya taratibu (hakikisho halipo).",
    "home.a4":"<b>Utambuzi kwa ultrasound kwanza</b> umekubalika katika miongozo ya kisasa — hospitali za kaunti tayari zina mashine za ultrasound.",
    "home.a5":"<b>Utetezi uliopo</b> (mf. Endo Sisters East Africa) na jamii za kitaalamu (KOGS, KESES).",
    "home.partners":"Mfumo wa washirika watarajiwa","home.partnersSub":"Hii ni dhana. Hakuna shirika lililofanya ushirikiano rasmi na EndoPima.",
    "home.road":"Ramani ya mradi — hadhi halisi","hm.r1s":"Sasa (v1.2)","hm.r1h":"Prototype","hm.r1p":"Demo ya muundo wa bidhaa — hapa tulipo.",
    "hm.r2s":"Inayofuata","hm.r2h":"Kubuni kimatibabu","hm.r2p":"Kazi na madaktari wa Kenya na mashirika ya wagonjwa kuunda upya uchunguzi.",
    "hm.r3s":"Pilot","hm.r3h":"Utumizi kaunti","hm.r3p":"Pilot ndogo, inayosimamiwa, katika kaunti 1–2 kwa idhini ya maadili.",
    "hm.r4s":"Thibitisha","hm.r4h":"Uthibitisho wa kimatibabu","hm.r4p":"Uthibitisho wa baadaye wa mantiki ya hatari — bado haujafanywa.",
    "hm.r5s":"Panua","hm.r5h":"Kaunti zaidi","hm.r5p":"Ikiwa uthibitisho utaiunga mkono.",
    "hm.r6s":"Baadaye","hm.r6h":"Msingi wa ushahidi Kenya","hm.r6p":"Data ndefu ya Kenya na, baadaye, mtandao wa akili wa endometriosis wa Afrika.",
    "pima.h":"Pima — angalia dalili zako",
    "pima.introH":"Kifaa hiki ni nini — na si nini",
    
    
    "pima.i3":"<b>Kuangaliwa kwa usalama</b> kunachambuliwa daima tofauti na alama.",
    "pima.i4":"Majibu yako hubaki <b>kwenye kifaa chako tu</b> — hakuna kinachotumwa popote.",
    "pima.warn":"<b>⚠️ Kama maumivu yako ni makali leo, au una homa na maumivu ya fupanyonga, au damu nyingi sana na kizunguzungu — nenda kituo cha afya kilicho karibu sasa.</b> Uchunguzi wa usalama ni muhimu kuliko alama yoyote.",
    "pima.start":"Anza Pima — dakika 3",
    "pima.gentle":"Unaweza kusimama wakati wowote na kurudi baadaye — majibu yako yatakuwa yakikusubiri hapa, kwenye kifaa hiki. Unaweza kufanya hivi peke yako, au na mtu unayemwamini.",
    "breath.t":"Pumua ndani… na nje. Uko salama hapa.",
    "breath.p":"Wakati wa utulivu kabla ya kuanza. Hakuna unachoshiriki kinachotumwa popote, na unaweza kusimama wakati wowote.",
    "breath.go":"Niko tayari — anza",
    "breath.skip":"Ruka — anza sasa",
    "pima.back":"← Rudi","pima.next":"Endelea →",
    
    "pass.sub2":"Dhana inayoonyeshwa kwa hifadhi ya kifaa. Rekodi tu kile madaktari walikueleza — usitunge matokeo. <b>Muhtasari wa afya ulioandaliwa na mgonjwa — si rekodi ya kimatibabu.</b>",
    "pass.timeline":"Safari yangu ya dalili","pass.addEvent":"+ Ongeza tukio",
    "pass.timelineH":"Mfano: <i>\"Umri 14 — maumivu makali ya mwezi yalianza\"</i>. Ongeza kila tukio unalokumbuka.",
    "pass.tlAge":"Umri (takriban)","pass.tlText":"Kilichotokea? (maneno yako)","pass.cancel":"Ghairi","pass.save":"Hifadhi",
    "pass.symH":"Dalili & athari — gusa ili kuchagua","pass.symH2":"Hizi hulisha muhtasari wako wa daktari.",
    "pass.impH":"Athari kwenye maisha","pass.careH":"Huduma za awali (vituo, tarehe, matibabu, mwitikio)",
    "pass.addCare":"+ Ongeza huduma ya awali","pass.cfF":"Kituo ulichohudumiwa","pass.cfD":"Tarehe takriban (mf. 2023)",
    "pass.cfR":"Rufaa?","pass.yes":"Ndiyo","pass.no":"Hapana",
    "pass.cfT":"Matibabu uliyopewa / maelezo uliyopewa (maneno yako)","pass.cfResp":"Ilikusaidia?",
    "pass.helped":"Ndiyo, ilisaidia","pass.little":"Kidogo au haikusaidi","pass.ongoing":"Bado inaendelea",
    "pass.invH":"Uchunguzi uliofanywa","pass.invH2":"Andika kilichofanywa na kile daktari alikueleza — kwa maneno yako. Hakuna matokeo yanayotengenezwa hapa.",
    "pass.invType":"Aina ya uchunguzi","pass.invUs":"Ultrasound","pass.invMri":"MRI","pass.invLab":"Kipimo cha maabara",
    "pass.invSurg":"Upasuaji / laparoscopy","pass.invOther":"Nyingine","pass.invNote":"Kile ulichoelezwa (maneno yako)",
    "pass.docH":"Uwasilishaji kwa daktari","pass.docH2":"Geuza pasipoti + pima ya mwisho kuwa muhtasari wa ukurasa mmoja unaoweza kuchapishwa. Unaonyesha wazi kuwa ni wa mgonjwa, si utambuzi.",
    "pass.docBtn":"Tengeneza Muhtasari wa Daktari","pass.prepBtn":"Jitayarishe kwa miadi yangu",
    "pass.prepH":"Orodha ya maandalizi ya miadi","pass.prepBring":"Leta:","pass.pb1":"Safari yako ya dalili (Pasipoti)","pass.pb2":"Matokeo ya awali / maelezo ya uchunguzi",
    "pass.pb3":"Orodha ya dawa unazotumia (pamoja na painkillers)","pass.pb4":"Nyandiko zozote za rufaa za awali","pass.pb5":"Maswali yako (hapo chini)",
    "pass.prepAsk":"Uliza:","pass.pa1":"Ni nini kinachoweza kusababisha dalili hizi?","pass.pa2":"Ni uchunguzi upi unaofaa kwangu?",
    "pass.pa3":"Ni chaguzi gani za matibabu, na faida na hatari zake?","pass.pa4":"Nifanye nije dalili zikiendelea au kuzidi?","pass.pa5":"Nirudi lini?",
    
    "thib.sub2":"Vituo vilivyoonyeshwa ni data ya mfano — thibitisha kabla ya kwenda.",
    "thib.path":"Njia ya huduma, kwa undani — si mstari mmoja kwa kila mtu",
    "thib.p1s":"Mwanzo","thib.p1h":"PIMA","thib.p1p":"Tambua dalili; amua kipaumbele.",
    "thib.p2s":"Daima","thib.p2h":"Tathmini ya kimatibabu","thib.p2p":"Daktari husikiliza, huchunguza, huamua. Hii ndiyo mlango wa kuingia kwa karibu kila mtu.",
    "thib.p3s":"Ikihitajika","thib.p3h":"Picha / vipimo","thib.p3p":"Ultrasound (mara nyingi kwanza), au uchunguzi mwingine daktari atakaouona.",
    "thib.p4s":"Ikibidi","thib.p4h":"Tathmini ya mtaalamu","thib.p4p":"Gynecologist au mtaalamu mwingine — tu pale daktari anapoamua ni muhimu.",
    "thib.p5s":"Mpango","thib.p5h":"Mpango wa matibabu","thib.p5p":"Usimamizi wa maumivu, homoni, physiotherapy, au upasuaji kwa wengine — unajadiliwa nawe.",
    "thib.p6s":"Kuendelea","thib.p6h":"Ufuatiliaji","thib.p6p":"Pitia upya, rekebisha, endeleza safari.",
    "thib.pathNote":"<b>Sio kila mtu anafuata njia moja.</b> Upasuaji — ikiwemo laparoscopy — si wa lazima kwa kila mgonjwa. Ni chaguo moja kati ya mengine, linalojadiliwa na daktari.",
    "thib.navH":"Hatua yako inayofuata — niende wapi?","thib.navSub":"Maswali mawili tu. Mwelekeo ni wa mfano — daktari ndiye anayeamua kikweli.",
    "thib.navQ1":"1. Uko wapi?","thib.navQ2":"2. Unahitaji msaada wa aina gani?","thib.other":"Kaunti yangu haijaorodheshwa",
    "thib.n1":"Tathmini ya kwanza (zungumza na mtu)","thib.n2":"Gynecology","thib.n3":"Ultrasound","thib.n4":"Tathmini ya mtaalamu",
    "thib.n5":"Msaada wa uzazi (fertility)","thib.n6":"Usimamizi wa maumivu","thib.n7":"Physiotherapy ya fupanyonga","thib.n8":"Msaada wa kisaikolojia","thib.n9":"Ufuatiliaji",
    "thib.navBtn":"Onyesha hatua yangu inayofuata",
    "thib.dir":"Orodha ya huduma","thib.d1":"Mikoa yote","thib.d2":"Huduma zote","thib.d3":"Kliniki ya EndoNurse (dhana)","thib.d4":"Ultrasound","thib.d5":"Gynecology / mtaalamu",
    "thib.dir2":"Vielelezo vilivyopangwa kama orodha halisi ingeonekana. Hakuna upatikanaji halisi unaoonyeshwa.",
    "thib.community":"Msaada wa jamii","thib.communityp":"Msaada wa wagonjwa upo Kenya na ni sehemu ya mfumo mfumo huu unafikiria kuunganisha. Msaada wa rika si matibabu.",
    "thib.community2":"Mfano (mshirika watarajiwa):","thib.community2b":"Endo Sisters East Africa Foundation — msaada wa rika, mikutano ya kila mwezi, mazungumzo ya shule. Sio ushirikiano rasmi — ona \"Washirika watarajiwa\".",
    
    "fanya.sub2":"Takwimu zote ni makadirio ya mfano isipokuwa zilizothibitishwa — SHA haihamisiki kamwe.",
    "fanya.costH":"Gharama yangu — tengeneza makadirio","fanya.costSub":"Chagua kategoria zinazohusika na hatua yako ya huduma. Viwango hutofautiana; kiwango cha SHA si sawa na kiasi mwisho mgonjwa analipa.",
    "fanya.costLow":"Makadirio ya chini","fanya.costHigh":"Makadirio ya juu","fanya.costSha":"Msaada wa SHA (si uhakika)",
    "fanya.costNote":"Makadirio ya mfano, si bei halisi. Uliza bei kwa maandishi kituoni. SHA inategemea sifa, pre-authorisation na ratiba rasmi.",
    "fanya.pocketH":"PimaPocket — mpangaji wa akiba","fanya.pocketSub":"Chombo cha kupanga, si bidhaa ya kifedha. EndoPima haishiki wala kuhamisha fedha — hakuna muamala wa M-Pesa hapa.",
    "fanya.pkGoal":"Lengo (KSh)","fanya.pkCurrent":"Akiba ya sasa (KSh)","fanya.pkMonthly":"Mchango wa mwezi (KSh)",
    "fanya.pkRemain":"Kilichobaki","fanya.pkMonths":"Miezi kwa kiwango chako","fanya.scen":"Mifumo ya michango",
    "fanya.fundH":"Baadaye: Mfuko wa Endo Care","fanya.fundSub":"Dhana ya jinsi msaada ungeweza kukusanywa. <b>Hakuna fedha zinazoshikiliwa au kuhamishwa na prototype hii.</b>",
    "fanya.fundR1":"Mfumo wa mfano wa kukusanya (dhana)","fanya.fundR2":"HAIFANYI KAZI","fanya.fundR3":"Akiba ya kibinafsi (mtindo wa PimaPocket)",
    "fanya.fundR4":"Michango ya familia na mwajiri","fanya.fundR5":"SACCO / chama","fanya.fundR6":"NGO / misaada / ufadhili wa afya","fanya.fundR7":"SHA ikistahili","fanya.fundR8":"KUTEGEMEA SIFA",
    "obs.h":"Observatory ya Endo ya Kenya","obs.sub":"Jinsi data inayoridhiwa, isiyo na majina, inavyoweza hatimaye kufahamisha huduma ya endometriosis Kenya.",
    "obs.warn1":"⚠️ DATA YA MFANO — SI MAKADIRIO YA TAIFA.","obs.warn2":"Kila namba hapa ni kubuniwa na ya mfano. Hakuna data halisi ya mgonjwa inayokusanywa, kuhifadhiwa au kuonyeshwa.",
    "obs.k1":"Waliofanyiwa pima (mfano)","obs.k2":"Kipaumbele cha juu (mfano)","obs.k3":"Waliothibitishwa kliniki (mfano)","obs.k4":"Muda wa kusubiri scan (mfano)",
    "obs.funnelH":"Kichujio cha huduma (funnel)","obs.funnelSub":"Kila namba hapa ni ya kubuni.",
    "obs.gapH":"Safari ya utambuzi na \"pengo la huduma\"","obs.gapSub":"Safari ya dalili inayoripotiwa na mgonjwa (mfano). Si kipimo rasmi cha ucheleweshaji.",
    "obs.gapNote":"<b>Inachoonyesha:</b> muda gani wanawake wanaweza kusubiri kila hatua kabla ya huduma sahihi. Katika pilot halisi, hizi zingeripotiwa na wagonjwa na kuthibitishwa na rekodi za kliniki.",
    "obs.distH":"Umri & mifumo ya dalili","obs.ageH":"Umri kwenye pima ya kwanza (mfano)","obs.symH":"Dalili zilizoripotiwa zaidi (mfano, %)",
    "obs.impactH":"Athari shule & kazi (mfano, zinazoripotiwa)","obs.countyH":"Ramani ya usawa wa kaunti",
    "obs.countySub":"Vipimo vya dhana. Hali ya uaminifu ya \"hakuna data\" ni bora kuliko takwimu za uongo — seli nyingi zimeachwa wazi kwa makusudi.",
    "obs.cCol":"Kaunti","obs.sCol":"Ufunikaji wa pima","obs.rCol":"Ufikiaji wa rufaa","obs.dCol":"Umri wa wastani wa safari","obs.xCol":"Kukamilisha huduma","obs.wCol":"Muda wa kusubiri",
    "shule.sub":"Kwa wanafunzi, walimu na wazazi. Jifunze, jijaribu, cheza hadithi — kamwe si ya kuogofya, kamwe si utambuzi.",
    "shule.t1":"📖 Jifunze","shule.t2":"🕹️ Jaribio","shule.t3":"🎭 Mchezo wa hadithi","shule.t4":"📅 Athari ya kutokuwepo shule",
    "sl.l1h":"1 · Endometriosis ni nini?","sl.l1p":"Hali sugu ambapo tishu kama za kuta za uzazi hukua nje ya uzazi — mara nyingi fupanyonga. Inaweza kusababisha maumivu makali ya mwezi, maumivu ya ngono au haja, damu nyingi, uchovu na kuathiri uzazi. Haiambukizi na si kosa la mtu.",
    "sl.l2h":"2 · Maumivu si ya kawaida","sl.l2p":"Usumbufu wa mwezi ni wa kawaida kwa wengine. Lakini maumivu yanayokufanya ukose shule, yanayozuia usingizi, au ambayo dawa kali haziwezi kuyamaliza — yanastahili kuangaliwa. Maumivu makali ya mwezi ni sababu ya kuzungumza na mtu mzima na, yakiendelea, na daktari.",
    "sl.l3h":"3 · Lini kutafuta msaada","sl.l3p":"Ikiwa maumivu yanazidi kwa miezi, yanatokea kati ya hedhi, yanauma wakati wa ngono au haja, au yaja na damu nyingi sana — zungumza na mtu mzima unayemwamini, wafanyakazi wa afya shuleni, au Msaidizi wa Afya wa Jamii. Kuangaliwa mapema ni muhimu.",
    "sl.l4h":"4 · Kuzungumza na mtu mzima","sl.l4p":"Chagua mtu unayemwamini: mzazi, shangazi, mwalimu, muuguzi wa shule. Sema waziwazi: \"Maumivu ya mwezi yangu ni makali hata nakosa shule.\" Hujazidi chochote. Mtu wa kwanza akikupuuza, jaribu mwingine. Endelea kuuliza mpaka usikilizwe.",
    "sl.l5h":"5 · Kilicho si hicho","sl.l5p":"Jaribio au app haiwezi kukuambia kuwa una endometriosis — daktari pekee anaweza. Endometriosis ni sababu moja kati ya nyingi. Kuijua ni nguvu; kujitambua si.",
    "shule.restart":"↺ Anza upya","shule.next":"Endelea →",
    "shule.attH":"Kiangazaji cha kutokuwepo shule (cha hiari)","shule.attSub":"Rekodi yako binafsi kwenye kifaa hiki. Kwa ridhaa yako, aina hii ya taarifa inaweza siku moja kuchangia utafiti wa elimu — lakini hakuna kinachokusanywa katika prototype hii.",
    "shule.attQ":"Siku ngapi za shule maumivu yalikuathiri mwezi huu?","shule.attSave":"Hifadhi mwezi huu","shule.attVizH":"Athari ya mwezi","shule.attNote":"Inahifadhiwa kwenye kivinjari chako tu kwenye kifaa hiki. Hakuna kinachopakiwa.",
    "shule.faqH":"Maswali ya wanafunzi",
    "shule.q1":"\"Cramps zangu ni mbaya sana. Je ni endometriosis?\"","shule.q1a":"Si lazima — lakini cramps kali zinazokufanya ukose shule, ambazo dawa hazisuluhishi, au zinazozidi mwezi wako, zinastahili kuangaliwa na daktari. Uchunguzi ni kuhusu kupata majibu, si kudhani ugonjwa.",
    "shule.q2":"\"Je nahitaji upasuaji kujua?\"","shule.q2a":"Si kila wakati. Daktari huamua uchunguzi unaofaa — mara nyingi kuanzia mazungumzo na wakati mwingine ultrasound. Upasuaji si hatua ya kwanza kwa kila mtu.",
    "shule.q3":"\"Maumivu yana urithi wetu. Nihangaike?\"","shule.q3a":"Historia ya familia ni jambo moja daktari anaweza kulizingatia. Si utambuzi; ni sababu ya kuwa makini na kujadili na mtaalamu wa afya.",
    "shule.q4":"\"Naongea na nani bila aibu?\"","shule.q4a":"Mwalimu unayemwamini, mzazi, wafanyakazi wa afya shuleni, au Msaidizi wa Afya wa Jamii. Maumivu ya mwezi ni mada ya afya kama nyingine. Hakuna aibu kuomba msaada.",
    "jamii.h":"Jamii — tabaka la jamii","jamii.sub":"Njia tatu ambazo mfumo huu ungeweza kufikia wanawake walipo: ufikiaji wa mtandamo wa chini wa USSD, Wasaidizi wa Afya wa Jamii, na uelekezaji wa rika. (Haya ni mawazo ya mfumo mzima — huhitaji yoyote kati yao kutumia EndoPima kwa ajili yako mwenyewe.)",
    "jamii.t1":"📟 Village Mode","jamii.t2":"👩🏾‍⚕️ CHP Mode","jamii.t3":"💬 Dada Navigator",
    "jamii.vH":"Village Mode — ufikiaji wa mtandamo mdogo","jamii.vSub":"Huonyesha jinsi EndoPima ingefanya kazi kwenye simu ya kawaida kwa USSD au menyu ya SMS. <b>Hakuna nambari halisi ya USSD au gateway iliyounganishwa.</b> Bonyeza namba au andika hapa chini.",
    "jamii.send":"TUMA","jamii.vWhyH":"Kwanini hii ni muhimu",
    "jamii.v1":"~30% ya simu Kenya bado ni za kawaida — na simu mahiri nyingi huunganika kwa vipindi.",
    "jamii.v2":"Njia ya USSD/SMS inamaanisha hakuna app ya kushusha, hakuna data, hakuna simu mahiri.",
    "jamii.v3":"Kila menyu inaingia moja kwa moja kwenye mantiki ile ile ya uelekezaji na ridhaa ya app.",
    "jamii.vNote":"Ni mfano wa prototype tu — muunganisho halisi ungehitaji nambari rasmi, mshirika wa mawasiliano, na uhakiki wa kufuata kanuni.",
    "jamii.chpH":"CHP Mode","jamii.chpSub":"Jinsi Msaidizi wa Afya wa Jamii angeweza kutumia mfumo huu. CHP hana kibali cha kutambua — hupima, husaidia na kupeleka rufaa. <b>Haijaunganishwa na eCHIS.</b>",
    "jamii.chpK1":"Pima (mfano)","jamii.chpK2":"Rufaa (mfano)","jamii.chpK3":"Ufuatiliaji unaodaiwa (mfano)","jamii.chpK4":"Zilizokamilika (mfano)","jamii.chpK5":"Zinazosubiri (mfano)","jamii.chpK6":"Alama za uelekezaji (mfano)",
    "jamii.chpSteps":"Mchakato (bonyeza utembee)","jamii.chpRost":"Ufuatiliaji wa kaya (roster ya mfano)","jamii.chpRost2":"Vielelezo vinavyoonyesha jinsi rufaa na ufuatiliaji vingefuatiliwa.",
    "jamii.chpR1":"Kaya","jamii.chpR2":"Pima","jamii.chpR3":"Rufaa","jamii.chpR4":"Hali",
    "jamii.dadaH":"Dada Navigator","jamii.dadaSub":"Kiongozi wa rika aliyefunzwa — si mtaalamu wa matibabu. <b>Uelekezaji wa rika husaidia safari ya afya lakini hauchukui nafasi ya huduma ya kitaalamu.</b>",
    "journey.h":"Safari yangu ya Endo","journey.sub":"Dashibodi yako: ulipo safari, nini cha kufanya baadaye, na kila kitu kikiwa pamoja kwenye kifaa hiki.",
    "journey.stage":"Hatua ya sasa","journey.flag":"Alama yangu ya kipaumbele cha dalili","journey.next":"Hatua yangu inayofuata:",
    "journey.shortcuts":"Njia za mkato","journey.s1":"📘 Pasipoti yangu","journey.s2":"🧭 Tafuta hatua inayofuata","journey.s3":"💰 Mpango wangu wa gharama","journey.s4":"🔐 Data na usiri wangu",
    "journey.appts":"Miadi yangu","journey.add":"+ Ongeza","journey.apD":"Tarehe","journey.apT":"Aina ya miadi","journey.apA":"Tathmini ya kimatibabu","journey.apU":"Ultrasound","journey.apG":"Gynecology","journey.apF":"Ufuatiliaji","journey.apP":"Kituo",
    "journey.reffs":"Rufaa zangu","journey.fuH":"Hujambo? Husaidiaje?","journey.fuSub":"Ukaguzi wa haraka baada ya ziara au matibabu. Majibu yako hubaki kwenye kifaa hiki na yanaendesha utambuzi wa \"Umechoka?\" hapa chini.",
    "journey.fuHist":"Historia ya ukaguzi",
    "more.h":"Ushahidi, maadili na mustakabali","more.sub":"Prototype nzuri inajua mipaka yake. Hapa ndipo tunapokuwa waaminifu kuzihusu.",
    "more.evH":"Ushahidi na mipaka",
    "more.e1":"Prototype hii <b>si kifaa cha matibabu</b> na haipaswi kamwe kutumiwa kutambua, kuondoa, au kutibu hali yoyote.",
    "more.e2":"Mantiki ya hatari ni <b>mara ya mfano — haijathibitishwa kimatibabu</b>. Hakuna madai ya usahihi wa utabiri.",
    "more.e3":"Takwimu zote za Observatory ni <b>data ya kubuni ya mfano</b>, si makadirio ya Kenya.",
    "more.e4":"Orodha ya huduma <b>si hai</b>; hakuna upatikanaji au ubora unaodaiwa. Utumizi halisi unahitaji hifadhidata ya vituo iliyothibitishwa.",
    "more.e5":"AI ya baadaye na biomarker ni <b>mawazo ya utafiti</b>, si bidhaa zilizopo.",
    "more.e6":"Utumizi halisi unahitaji washirika wa kimatibabu, uthibitisho wa kimatibabu, idhini ya maadili kwa utafiti, na kufuata mahitaji ya sheria za ulinzi wa data na afya za Kenya.",
    "more.e7":"Miunganisho halisi (USSD, eCHIS, SHA, M-Pesa, mifumo ya hospitali) inahitaji idhini rasmi na kazi ya kiufundi — hakuna iliyounganishwa hapa.",
    "more.labH":"Future Lab","more.labSub":"Ambapo teknolojia ya juu inaelezewa kwa uaminifu kama kazi ya baadaye. <b>Hakuna kati ya hizi inayopatikana kupitia EndoPima leo.</b>",
    "more.l1h":"Ultrasound ya AI","more.l1p":"Msaada unaowezekana wa uamuzi kwa madaktari wanaosoma picha — kamwe si mbadala wa uamuzi wa kimatibabu.",
    "more.l2h":"Upimaji wa biomarker","more.l2p":"Utafiti wa baadaye wa damu / mate / maji ya hedhi. Unahitaji maabara, uthibitisho na bei za ufikiaji kwa nchi za mapato ya chini.",
    "more.l3h":"Mfano wa AI wa Kenya","more.l3p":"Unahitaji data iliyokusanywa kimaadili, uthibitisho wa kimatibabu kwa wakazi wa Kenya wa kuwakilisha, uthibitisho wa nje na tathmini ya upendeleo.",
    "more.resH":"Sajili ya utafiti","more.resSub":"Mchakato wa baadaye wa ridhaa. Katika prototype hii hakuna kinachoacha kifaa chako.",
    "more.resQ":"Je, ungependa kuchangia taarifa zisizo na majina kwa utafiti wa baadaye wa endometriosis?",
    "more.resY":"Ndiyo","more.resN":"Hapana",
    "more.resP":"Kusema hapana hakuathiri msaada wowote unaopokea. Ushiriki ungeelezwa kikamilifu kabla ya ukusanyaji wowote halisi, na unaweza kujitoa wakati wowote.",
    "more.consH":"Data yangu & ridhaa","more.consSub":"Katika prototype hii, data inahifadhiwa kwenye kivinjari chako tu. Vidhibiti hivi vinaonyesha jinsi ridhaa ingefanya kazi utumizini halisi.",
    "more.consWhat":"EndoPima ingehifadhi nini","more.cs1":"Majibu ya dalili","more.cs2":"Safari ya huduma (miadi, rufaa)","more.cs3":"Taarifa za hiari za kidemografia","more.cs4":"Chaguo za ridhaa",
    "more.cn":"Tumia taarifa zangu kwa uelekezaji wa huduma <i>(inahitajika kwa huduma kufanya kazi)</i>",
    "more.cr":"Ruhusu taarifa zisizo na majina zichangie utafiti <i>(hiari, imezimwa)</i>",
    "more.cf":"Pokea ujumbe wa ufuatiliaji <i>(hiari)</i>",
    "more.saveConsent":"Hifadhi chaguo zangu","more.consNote":"Kujitoa kunawezekana wakati wowote; ridhaa ya utafiti si sharti la kupata msaada wa kimsingi.",
    "more.privH":"Kanuni za usiri",
    "more.privP":"<b>Imeundwa kwa ajili ya kufuata siku zijazo</b> mahitaji ya sheria za ulinzi wa data na taarifa za afya za Kenya. Hakuna vyeti au hadhi za kufuata zinazodaiwa, kwa sababu hakuna kilichotekelezwa.",
    "more.archH":"Usanifu — tayari kwa backend",
    "more.archL1":"<b>Offline kwanza:</b> prototype huandika na kusoma kwenye kifaa hiki papo hapo — imeundwa kwa mtandamo dhaifu na simu za kawaida.",
    "more.archL2":"<b>Usawazishaji wa cloud ulio tayari:</b> schema ya Supabase (<i>backend/supabase_schema.sql</i>) na adapter ya REST bila SDK (<i>backend/adapter.example.js</i>) zimejumuishwa. Bandika URL ya mradi + anon key kwenye <code>SUPABASE_CONFIG</code> mwanzoni mwa script kuweka usawazishaji WASHI.",
    "more.archL3":"<b>Hakuna kinachotumwa mpaka ufanye hivyo.</b> Katika mfumo wa demo data haioni kifaa hiki; hata usawazishaji ukiwasha, ridhaa ya utafiti inabaki ya hiari.",
    "more.cloudOff":"DEMO — hifadhi ya kifaa hiki pekee (hakuna cloud iliyounganishwa).",
    "more.cloudOn":"Cloud sync WASHI (Supabase) — maandiko yanaakisiwa kwenye mradi wako.",
    "more.rd":"Ramani (tena, kwa uaminifu)","more.r1h":"Sasa","more.r1p":"Prototype inayoonyesha muundo wa bidhaa.","more.r2h":"Inayofuata","more.r2p":"Kubuni kimatibabu na madaktari wa Kenya na mashirika ya wagonjwa.",
    "more.r3h":"Pilot","more.r3p":"Utumizi mdogo wa kaunti unaosimamiwa na idhini ya maadili.","more.r4h":"Thibitisha","more.r4p":"Uthibitisho wa kimatibabu wa baadaye wa mantiki ya hatari.",
    "more.r5h":"Panua","more.r5p":"Kaunti zaidi, ikiwa uthibitisho utaiunga mkono.","more.r6h":"Baadaye","more.r6p":"Data ndefu ya Kenya → mtandao wa akili wa endometriosis wa Afrika.",
    "more.rd2":"Hakuna hatua za baadaye zilizotokea bado. Ramani hii ni mpango, si rekodi.",
    "foot.s0":"Dhana ya: kutambua dalili → kuelekea huduma → kufadhili huduma → kuthibitisha ushahidi.",
    "foot.sources":"Muktadha & vyanzo","foot.s1":"Ripoti kamili ya utafiti (na vyanzo): 'Endometriosis_Kenya_Research_and_Idea.md'",
    "foot.s2":"Mfumo wa kimatibabu watarajiwa: KOGS · KESES · Chuo Kikuu cha Nairobi · Endo Sisters East Africa",
    "foot.s3":"Dhana ya elimu na uelekezaji tu — si ushauri wa matibabu, si kifaa cha matibabu.",
    "doc.title":"Muhtasari Wangu wa Daktari","doc.print":"🖨️ Chapisha","doc.dl":"⬇️ Pakua (.txt)","doc.share":"📤 Shiriki kwa simu",
    "pass.stg0":"Hakuna hatua bado — anza Pima.","thib.dms":"DATA YA MFANO","jamii.gs":"Mwongozo:","jamii.ya":"NDIYO","jamii.hapana":"HAPANA",
    "obs.na":"Data haipatikani bado","obs.demo":"MFANO",
    "nav.home":"Nyumbani","nav.pima":"Angalia dalili","nav.pass":"Hadithi yangu","nav.thibiti":"Tafuta huduma","nav.shule":"Jifunze",
    "nav.more":"Zaidi","nav.more2":"Kuhusu & faragha","nav.fanya":"Gharama · Fanya","nav.obs":"Observatory","nav.jamii":"Jamii","nav.journey":"Safari yangu",
    "hero.pill":"Nafasi tulivu na ya faragha kwa hadithi yako ya afya · Kenya",
    
    
    "hero.note":"Faragha. Bila hukumu. Si utambuzi.",
    "hero.cta1":"Angalia dalili zangu",
    "home.seeH":"Wewe si unazidisha.","home.see1":"Maumivu yanayosumbua maisha yako yanastahili kuzingatiwa.",
    "home.see2":"Si lazima uthibitishe kwamba maumivu yako ni &ldquo;makali vya kutosha&rdquo; kabla ya kutafuta msaada.",
    "home.see3":"Hili si juu ya kutambua ugonjwa. Ni juu ya kusikilizwa — na kupata hatua sahihi inayofuata.",
    "home.j1":"Kuna kitu hakiko sawa","home.j2":"Nataka kuelewa","home.j3":"Nataka kujiandaa","home.j4":"Nataka kujua niende wapi","home.j5":"Nataka nisikilizwe","home.j6":"Nataka huduma sahihi",
    "home.jN":"Njia ya kila mtu ni tofauti — hii ni mwelekeo, si sheria.",
    "home.expH":"Maumivu yanapoanza kuchukua maisha yako","home.expSub":"Kama yoyote kati ya haya yanakusikia — hujambo, na wewe si peke yako.",
    "home.e1":"Kukosa shule au kazi kwa sababu ya mwezi",
    "home.e2":"Kushindwa kusimama, kutembea au kulala kwa sababu ya maumivu",
    "home.e3":"Maumivu yanayorudi kila mwezi, tena na tena",
    "home.e4":"Damu nyingi sana",
    "home.e5":"Maumivu wakati wa ngono",
    "home.e6":"Maumivu ya haja kubwa au ndogo wakati wa mwezi",
    "home.e7":"Uchovu mkubwa unaozuia siku zako",
    "home.e8":"Kuvimba au dalili za mmeng'enyo karibu na mwezi",
    "home.e9":"Ziara nyingi kwa wahudumu bila majibu",
    "home.e10":"Kuhisi kwamba hakuna anayekuamini",
    "home.expNote":"<b>Dalili hizi zinaweza kuwa na sababu mbalimbali.</b> Si lazima ziwe endometriosis. Mtaalamu wa afya anaweza kusaidia kutambua kinachotokea — orodha hii inaelezea uzoefu, si utambuzi.",
    "home.voicePill":"Sauti za wanawake","home.voiceH":"Wewe si peke yako.",
    "home.voiceP":"Hatutabuni maneno kwa wanawake kisha kuyasema ni halisi. Hadithi halisi, zisizo na majina, kutoka kwa wanawake wa Kenya — zilizoshirikishwa kwa ridhaa — zitaonekana hapa baada ya utafiti wa jamii.",
    "home.voicePh":"🕊️ Sauti za wagonjwa zitaongezwa baada ya utafiti wa kimaadili wa jamii unaozingatia ridhaa.",
    "home.privH":"Hadithi yako ya afya ni yako.",
    "home.priv1":"Kila unachoandika kinabaki kwenye kifaa hiki. Hakuna kinachotumwa popote isipokuwa ukiwasha usawazishaji wa cloud — na umezimwa kwa chaguo-msingi.",
    "home.priv2":"Hakuna akaunti, hakuna jina, hakuna namba ya simu inayohitajika. Unaweza kurudi wakati wowote na kuendeleza hadithi yako.",
    "home.priv3":"Unaweza kufuta kila kitu kwenye kifaa hiki kwa kugusa moja, wakati wowote.",
    "home.wipe":"Futa kila kitu kwenye kifaa hiki","home.privMore":"Soma zaidi kuhusu faragha",
    "home.ctx":"Picha kubwa, kwa muktadha","home.ctxNote":"Muktadha si hadithi kuu — wewe ndiye. Vyanzo: WHO (190M); EAMJ 2018, Kagia na wenzake (94% ya vijana 313 wa Kenya); mpango wa Wasaidizi wa Afya wa Jamii wa Wizara ya Afya, 2024; tafiti za kimataifa za kuchelewa kwa utambuzi (data ya Kenya ni finyu).",
    "home.how":"Zaidi kuhusu wazo — jinsi vipande vinavyofungamana",
    "home.howsub":"Kila hatua hapa ni sehemu halisi ya safari ya mwanamke. Ukaguzi ni mwanzo tu: wazo ni PIMA → <b>HUDUMA KAMILI</b>.",
    "pima.sub":"Hebu tuelewe unachopitia. Karibu dakika 3, maswali rahisi, hakuna maneno magumu ya kitiba — Msaidizi wa Afya wa Jamii anaweza kufanya pamoja nawe.",
    "pima.i1":"<b>Ni:</b> ukaguzi wa dalili unaokusaidia kupanga unachopitia na kufikiri kama tathmini ya kimatibabu inaweza kuwa muhimu.",
    "pima.i2":"<b>Si:</b> utambuzi, kipimo, wala uthibitisho kuwa una (au huna) endometriosis.",
    "pass.h":"Pasipoti — Hadithi yako, mahali pamoja",
    "pass.sub":"Huenda ulilazimika kueleza dalili zilezile tena na tena. Pasipoti huweka <b>hadithi yako</b> ya afya pamoja — dalili, athari, huduma za awali, uchunguzi — ili uichukue unapotafuta huduma. Ni hadithi yako, si rekodi ya kimatibabu, na haichukui nafasi ya maelezo ya daktari.",
    "pass.beforeH":"Kabla hujaenda","pass.beforeP":"Mambo machache yanayostahili kutambua kabla ya miadi — si lazima uwe na majibu kamili.",
    "pass.b1":"Dalili gani zinakusumbua zaidi?","pass.b2":"Zilianza lini? Zinakuwa mbaya zaidi lini?",
    "pass.b3":"Zinaathirije shule, kazi, usingizi au mahusiano?","pass.b4":"Umeshajaribu nini, na kilichotokea?",
    "pass.b5":"Una maswali gani unayotaka kuuliza?",
    "pass.beforeN":"💛 <b>Hadithi yako inastahili kufika pamoja nawe.</b> Hupaswi kulazimika kukumbuka kila kitu ukiwa umeketi mbele ya daktari — ndiyo maana hadithi hii ipo.",
    "thib.h":"Tafuta huduma — Niende wapi sasa?",
    "thib.sub":"Taarifa halisi za vituo vya afya bado hazipo — kila unachokiona hapa chini ni <b>mfano wa onyesho</b>, ili uone jinsi wazo lingefanya kazi. Katalogi halisi itajengwa na timu za afya za kaunti. Unachoweza kutumia leo: njia ya huduma, maswali ya kuuliza, na vya kuleta.",
    "fanya.h":"Gharama — panga na andaa safari",
    "fanya.sub":"Una wasiwasi wa gharama ya huduma? Tunajua gharama za afya huathiri <b>lini</b> na <b>wapi</b> mtu anatafuta msaada. Fanya hukusaidia kukadiria na kupanga — <b>si</b> huduma ya malipo, hakuna bei zilizothibitishwa hapa, na hakuna pesa inayopita kupitia app hii.",
    "shule.h":"Jifunze — &ldquo;Maumivu Si ya Kawaida&rdquo;",
    "shule.vPill":"Video fupi — zimepangwa, si za kufanya",
    "shule.vH":"Video za lugha rahisi zinakuja — zenye manukuu, bila kucheza peke yake, na zinazotumia data kidogo.",
    "shule.vP":"Video tatu fupi zimepangwa (sekunde 60–90 kila moja, zenye manukuu). Hadi zitengenezwe, <b>kila kitu hapa chini ni toleo la maandishi</b> — hutahitaji video kamwe kuelewa jambo muhimu.",
    "shule.v1":"<b>Endometriosis ni nini?</b> — maneno rahisi, hakuna picha za kuogofya. (Maandishi: Somo la 1 hapa chini.)",
    "shule.v2":"<b>Maumivu ya mwezi yanapostahili kuzingatiwa</b> — maana ya &ldquo;yanayosumbua&rdquo;. (Maandishi: Somo la 2 hapa chini.)",
    "shule.v3":"<b>Kujiandaa kwa miadi yako</b> — jinsi Pasipoti inavyokusaidia kupanga dalili, huduma za awali na maswali. (Maandishi: Pasipoti → Kabla hujaenda.)",
  }
};

let LANG = 'en';
function L(en, sw){ return LANG==='sw' ? sw : en; }
function t(key){
  const el = document.querySelector(`[data-i18n="${key}"]`);
  return el ? el.textContent : key;
}
function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if(el.dataset.base===undefined) el.dataset.base = el.innerHTML;   // remember the original text once
    if(LANG==='sw'){ if(T.sw[k] !== undefined) el.innerHTML = T.sw[k]; }
    else { el.innerHTML = el.dataset.base; }
  });
  document.getElementById('langEn').classList.toggle('active', LANG==='en');
  document.getElementById('langSw').classList.toggle('active', LANG==='sw');
  document.documentElement.lang = LANG;
  refreshActive();          // re-render dynamic views in both languages
  refreshTyped(true);       // typewriter words follow the live language
}
function setLang(l){ LANG=l; applyI18n(); }

/* ---------- Safe storage ---------- */
const Store = (() => {
  let mem = {}; let ok = false;
  try { localStorage.setItem('__ep_t','1'); localStorage.removeItem('__ep_t'); ok = true; } catch(e){ ok = false; }
  return {
    get(k, d){ try { const v = ok ? localStorage.getItem(k) : mem[k]; return v==null ? d : JSON.parse(v); } catch(e){ return d; } },
    set(k, v){ try { const s = JSON.stringify(v); if(ok) localStorage.setItem(k,s); else mem[k]=s; } catch(e){} },
    del(k){ try { if(ok) localStorage.removeItem(k); delete mem[k]; } catch(e){} },
    wipe(){ try {
      if(ok){ const ks=[]; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k && k.indexOf('ep_')===0) ks.push(k); }
        ks.forEach(k=>localStorage.removeItem(k)); }
      else mem={};
    } catch(e){} }
  };
})();
function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(()=>el.classList.remove('show'), 2600);
}

/* ---------- Centralised DEMO DATA (fictional) ---------- */
const DemoData = {
  kpis: { screened:12480, flagged:2160, confirmed:486, medWaitMonths:9.6 },
  funnel: [ /* stage label key, value */
    ['screened', 12480], ['flagged', 2400], ['assessed', 1300], ['imaged', 700],
    ['specialist', 210], ['assessedSpec', 90], ['treated', 60]
  ],
  gap: [ /* patient-reported (illustrative) median years per stage */
    ['onset1', 3], ['visit2', 5], ['eval3', 6.2], ['spec4', 7]
  ],
  ageDist: [['15–19',12],['20–24',26],['25–29',28],['30–34',19],['35–39',10],['40+',5]],
  symPattern: [['Maumivu makali ya mwezi',86],['Maumivu ya haja',52],['Damu nyingi',47],['Maumivu ya ngono',38],['Uchovu',61]],
  impact: { days: [['0',34],['1–2',38],['3–5',19],['6+',9]] },
  careGap: [0,3,5,6.2,7],
  chp: { screenings:132, referrals:25, fuDue:18, completed:9, pending:16, navFlags:4 },
  roster: [
    { h:'Kaya A — Gatundu',  s:'Done',  r:'Kiambu L5',   st:'pending' },
    { h:'Kaya B — Kisumu W.',s:'Done',  r:'JOOTT',       st:'completed' },
    { h:'Kaya C — Machakos', s:'Due',   r:'—',           st:'none' },
    { h:'Kaya D — Mombasa',  s:'Done',  r:'Coast Gen.',  st:'pending' },
    { h:'Kaya E — Nyeri',    s:'Done',  r:'Nyeri L5',    st:'failed' },
    { h:'Kaya F — Nakuru',   s:'Due',   r:'—',           st:'none' }
  ],
  counties: [
    ['Nairobi',214],['Kiambu',96],['Kisumu',74],['Mombasa',62],['Nakuru',51],['Uasin Gishu',38],['Nyeri',29],['Machakos',27]
  ],
  costCats: [
    { id:'consult', en:'Consultation (outpatient)', sw:'Ushauri (outpatient)', lo:1500, hi:3000 },
    { id:'imaging', en:'Imaging (ultrasound / MRI)', sw:'Picha (ultrasound / MRI)', lo:3000, hi:12000 },
    { id:'labs', en:'Laboratory investigations', sw:'Vipimo vya maabara', lo:2000, hi:6000 },
    { id:'meds', en:'Medication (per month)', sw:'Dawa (kwa mwezi)', lo:1000, hi:4000 },
    { id:'spec', en:'Specialist consultation', sw:'Ushauri wa mtaalamu', lo:2500, hi:6000 },
    { id:'transport', en:'Transport (per visit)', sw:'Usafiri (kwa ziara)', lo:500, hi:5000 },
    { id:'stay', en:'Accommodation (if far from home)', sw:'Malazi (ukiwa mbali)', lo:0, hi:10000 },
    { id:'surgery', en:'Surgery (if recommended)', sw:'Upasuaji (ukipendekezwa)', lo:80000, hi:200000 },
    { id:'follow', en:'Follow-up visits', sw:'Ziara za ufuatiliaji', lo:1000, hi:5000 }
  ],
  fundSources: [
    ['💪', 'individual', 'Individual savings'],
    ['👨‍👩‍👧', 'family', 'Family contributions'],
    ['🏢', 'employer', 'Employers'],
    ['🤝', 'sacco', 'SACCOs / chamas'],
    ['🌍', 'ngo', 'NGOs & philanthropic funds'],
    ['🏥', 'financing', 'Healthcare financing']
  ],
  facilities: [
    { n:'Kenyatta National Hospital — Gynaecology', c:'Nairobi', t:['us','surg'], l:'Referral hub · demo' },
    { n:'Nairobi Hospital — Endo Unit', c:'Nairobi', t:['us','surg'], l:'Private · demo' },
    { n:'EndoNurse Clinic — Kiambu (KUTTRH)', c:'Kiambu', t:['endonurse','us'], l:'Concept pilot · demo' },
    { n:'EndoNurse Clinic — Kisumu (JOOTT)', c:'Kisumu', t:['endonurse','us'], l:'Concept pilot · demo' },
    { n:'EndoNurse Clinic — Mombasa (Coast General)', c:'Mombasa', t:['endonurse','us'], l:'Concept pilot · demo' },
    { n:'Moi Teaching & Referral Hospital', c:'Uasin Gishu', t:['us','surg'], l:'Referral hub · demo' },
    { n:'Nakuru Level 5 — Radiology', c:'Nakuru', t:['us'], l:'County · demo' },
    { n:'Nyeri Level 5 — Radiology', c:'Nyeri', t:['us'], l:'County · demo' },
    { n:'Machakos Level 5 — Radiology', c:'Machakos', t:['us'], l:'County · demo' },
    { n:'Excision Surgeon Network (Nairobi)', c:'Nairobi', t:['surg'], l:'Specialist referral · demo' },
    { n:'CHP household screening — your village', c:'all', t:['endonurse'], l:'Community Health Promoter · concept' }
  ],
  partners: ['PATIENTS','COMMUNITY HEALTH PROMOTERS','ENDO SISTERS / PATIENT ORGANISATIONS','CLINICIANS','HOSPITALS','UNIVERSITIES','RESEARCH INSTITUTIONS','COUNTY HEALTH SYSTEMS','MINISTRY OF HEALTH','HEALTH FINANCING SYSTEM','TECHNOLOGY PARTNERS'],
  privCards: [
    ['🗂️','Data minimization','Collect only what is needed'],
    ['🔒','Encryption','Protect data in transit & at rest'],
    ['👤','Access control','Only authorised people see personal data'],
    ['🧾','Audit trails','Record who accessed what, when'],
    ['🪪','De-identification','Separate identity from health data'],
    ['✅','Consent','Clear, informed, revocable choices'],
    ['↩️','Withdrawal','Leave the programme at any time']
  ]
};

/* ---------- Mock API layer (future: replace with real endpoints) ----------
   BACKEND-READY: local storage stays the source of truth (works offline);
   when SUPABASE_CONFIG below is filled in, every write is ALSO mirrored
   best-effort to Supabase via the Cloud service (plain REST, no SDK).
   Unit of truth remains the device: the schema uses device_id as the key.
   See backend/supabase_schema.sql + backend/adapter.example.js            */
const SUPABASE_CONFIG = { url:'', anonKey:'' }; // <- leave EMPTY for demo mode (on-device storage only)

const DEVICE_ID = (() => {
  let id = Store.get('ep_device_id', null);
  if(!id){ id = 'dev-'+Math.random().toString(36).slice(2)+Date.now().toString(36); Store.set('ep_device_id', id); }
  return id;
})();

const Cloud = {
  enabled: !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey),
  async req(table, method, body, query){
    const url = `${SUPABASE_CONFIG.url}/rest/v1/${table}${query?'?'+query:''}`;
    const res = await fetch(url, {
      method,
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if(!res.ok) throw new Error('cloud '+table+' '+res.status);
    return res.json();
  },
  push(table, row){
    if(!this.enabled) return;
    this.req(table, 'POST', [{device_id: DEVICE_ID, ...row}], 'on_conflict=device_id')
      .catch(e => console.warn('[EndoPima] cloud sync deferred:', e.message));
  }
};

const API = {
  screening: { save: r => { Store.set('ep_screening', r);
      Cloud.push('screenings', { context:r.context||'self', answers:r.answers||{}, score:r.score, band:r.band, red_flags:r.redFlags||null, contrib:r.contrib||[] }); },
    latest: () => Store.get('ep_screening', null) },
  passport:  { save: p => { Store.set('ep_passport', p);
      Cloud.push('passports', { timeline:p.timeline, syms:p.syms, imps:p.imps, care:p.care, invs:p.invs }); },
    load: () => Store.get('ep_passport', null) },
  consent:   { save: c => { Store.set('ep_consent', c);
      Cloud.push('consents', { navigation:c.navigation, research:c.research, followup:c.followup }); },
    load: () => Store.get('ep_consent', null) },
  journey:   { save: j => { Store.set('ep_journey', j);
      Cloud.push('journeys', { stage:j.stage||'pima', appts:j.appts||[], reffs:j.reffs||[], fus:j.fus||[] }); },
    load: () => Store.get('ep_journey', { appts:[], reffs:[], fus:[] }) },
  att:       { save: d => Store.set('ep_att', d), load: () => Store.get('ep_att', []) },
  research:  { save: v => Store.set('ep_research', v), load: () => Store.get('ep_research', null) }
};

/* ---------- Router ---------- */
const RENDER = {}; // sectionId -> render fn (called on enter + on lang switch)
let ACTIVE = 'home';
function go(sec){
  ACTIVE = sec;
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('show'));
  document.getElementById('sec-'+sec).classList.add('show');
  document.querySelectorAll('.navlinks button').forEach(b=>{
    const on = b.dataset.sec===sec; b.classList.toggle('active', on);
    if(on) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
  window.scrollTo({top:0, behavior:'auto'});
  refreshActive();
}
function refreshActive(){
  if(RENDER[ACTIVE]) RENDER[ACTIVE]();
  if(ACTIVE!=='pima') return;
}
/* =====================================================================
   UI — HOME
===================================================================== */
RENDER.home = () => {
  drawFlywheel();
  renderPartners();
};
function renderPartners(){
  document.getElementById('partnerChips').innerHTML =
    DemoData.partners.map(p=>`<span class="tag t3" style="font-size:.72rem;padding:9px 13px">${p}</span>`).join('');
}
function drawFlywheel(){
  const items = [
    'COMMUNITY','PIMA','CARE NAVIGATION','CLINICAL ASSESSMENT','THIBITI','FANYA',
    'FOLLOW-UP','CONSENTED DATA','ENDO OBSERVATORY','RESEARCH + POLICY','BETTER CARE'
  ];
  const cx=180, cy=180, R=138, n=items.length;
  const pos = items.map((_,i)=>{ const a=-Math.PI/2 + i*2*Math.PI/n; return [cx+R*Math.cos(a), cy+R*Math.sin(a)]; });
  const wrap = s => s.length>13 ? s.slice(0,13)+'\n'+s.slice(13) : s;
  let arcs='', nodes='';
  for(let i=0;i<n;i++){
    const [x1,y1]=pos[i], [x2,y2]=pos[(i+1)%n];
    arcs += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}"
      fill="none" stroke="#D9C6DD" stroke-width="2" marker-end="url(#epArr)"/>`;
    const [x,y]=pos[i];
    const lines = wrap(items[i]).split('\n');
    let ty = y - ((lines.length-1)*6.5) + 4;
    nodes += `<g><circle cx="${x}" cy="${y}" r="52" fill="#fff" stroke="#EFE3EA" stroke-width="2"/>
      ${lines.map(txt=>`<text x="${x}" y="${ty+=13}" text-anchor="middle" dominant-baseline="middle" style="font-size:10.5px;font-family:Georgia,serif;font-weight:700;fill:#8A6D9E">${txt}</text>`).join('')}</g>`;
  }
  document.getElementById('flywheelBox').innerHTML = `
    <svg id="flySVG" viewBox="0 0 360 360" role="img" aria-label="EndoPima flywheel">
      <defs><marker id="epArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="#B78BAC"/></marker></defs>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#F6E4EC" stroke-width="26" opacity=".45"/>
      ${arcs}${nodes}
      <circle cx="${cx}" cy="${cy}" r="46" fill="#8A6D9E"/>
      <text x="${cx}" y="${cy-6}" text-anchor="middle" style="font-family:Georgia,serif;font-size:13px;font-weight:800;fill:#DFA968">ENDOPIMA</text>
      <text x="${cx}" y="${cy+12}" text-anchor="middle" style="font-size:8px;fill:#F3E1EE">${LANG==='sw'?'Gurudumu la huduma':'Care flywheel'}</text>
    </svg>`;
}

/* =====================================================================
   UI — PIMA (screener v2 + safety layer + results)
===================================================================== */
const QS = [
 {g:'G1', key:'age', en:'How old are you?', sw:'Una umri gani?', opts:[
   {en:'Under 18',sw:'Chini ya 18',s:0},{en:'18–24',sw:'18–24',s:2},{en:'25–34',sw:'25–34',s:3},
   {en:'35–44',sw:'35–44',s:2},{en:'45 and above',sw:'45 na zaidi',s:1}]},
 {g:'G1', key:'severity', en:'How bad is your period pain?', sw:'Maumivu ya mwezi ni makali kiasi gani?', opts:[
   {en:'Mild — painkillers usually work', sw:'Madogo — dawa kwa kawaida husaidia', s:0},
   {en:'Moderate — sometimes I miss school/work', sw:'Ya kati — nyakati fulani nakosa shule/kazi', s:10},
   {en:'Severe — I regularly miss school/work, painkillers don\'t help', sw:'Makali sana — nakosa shule/kazi mara kwa mara, dawa hazisaidii', s:20}]},
 {g:'G1', key:'duration', en:'How long have your periods been this painful (or getting worse)?', sw:'Maumivu haya yamekuwa ya muda gani (au yanazidi kuwa mabaya)?', opts:[
   {en:'Less than 6 months', sw:'Chini ya miezi 6', s:2},{en:'6–12 months', sw:'Miezi 6–12', s:4},
   {en:'1–3 years', sw:'Miaka 1–3', s:8},{en:'More than 3 years', sw:'Zaidi ya miaka 3', s:12}]},
 {g:'G1', key:'cycle', en:'When does the pain happen?', sw:'Maumivu yanatokea lini?', opts:[
   {en:'Mostly during my period', sw:'Zaidi wakati wa hedhi', s:0},
   {en:'Starts before my period and lasts after it', sw:'Huanza kabla ya hedhi na kuendelea baada yake', s:6},
   {en:'Throughout most of the month', sw:'Mwezi mzima karibu', s:10}]},
 {g:'G1', key:'pelvic', en:'Pelvic pain at other times of the month (not just during your period)?', sw:'Maumivu ya fupanyonga nyakati nyingine za mwezi (si wakati wa hedhi tu)?', opts:[
   {en:'No', sw:'Hapana', s:0},{en:'Sometimes', sw:'Nyakati fulani', s:5},{en:'Often', sw:'Mara nyingi', s:10}]},
 {g:'G2', key:'bowel', en:'Pain when passing stool, especially during your period?', sw:'Maumivu wakati wa haja kubwa, hasa wakati wa hedhi?', opts:[
   {en:'No', sw:'Hapana', s:0},{en:'Yes', sw:'Ndiyo', s:10}]},
 {g:'G2', key:'urine', en:'Pain when passing urine, especially during your period?', sw:'Maumivu wakati wa haja ndogo, hasa wakati wa hedhi?', opts:[
   {en:'No', sw:'Hapana', s:0},{en:'Yes', sw:'Ndiyo', s:8}]},
 {g:'G2', key:'sex', en:'Pain during or after sex?', sw:'Maumivu wakati wa ngono au baada yake?', opts:[
   {en:'Never / not applicable', sw:'Kamwe / sihusiki', s:0},{en:'Sometimes', sw:'Nyakati fulani', s:4},{en:'Often or always', sw:'Mara nyingi au kila mara', s:8}]},
 {g:'G2', key:'heavy', en:'Very heavy or very long periods (7+ days, or changing every 1–2 hours)?', sw:'Hedhi nzito sana au ndefu (siku 7+, au kubadilisha kila saa 1–2)?', opts:[
   {en:'No', sw:'Hapana', s:0},{en:'Yes', sw:'Ndiyo', s:6}]},
 {g:'G2', key:'bloat', en:'Troublesome bloating around your period?', sw:'Kuvimba kutatanisha karibu na mwezi wako?', opts:[
   {en:'No', sw:'Hapana', s:0},{en:'Yes', sw:'Ndiyo', s:4}]},
 {g:'G2', key:'gi', en:'Constipation or diarrhoea that gets worse with your period?', sw:'Kuhara au kuvimbiwa kuzidi wakati wa hedhi?', opts:[
   {en:'No', sw:'Hapana', s:0},{en:'Yes', sw:'Ndiyo', s:5}]},
 {g:'G2', key:'fatigue', en:'Does tiredness/exhaustion limit your daily life?', sw:'Je uchovu unazuia maisha yako ya kila siku?', opts:[
   {en:'No', sw:'Hapana', s:0},{en:'Sometimes', sw:'Nyakati fulani', s:3},{en:'Often', sw:'Mara nyingi', s:6}]},
 {g:'G3', key:'fertility', en:'Have you been trying to conceive for 12+ months without success?', sw:'Je umekuwa ukijaribu kupata mimba kwa miezi 12+ bila mafanikio?', opts:[
   {en:'Not trying', sw:'Sijajaribu', s:0},{en:'No', sw:'Hapana', s:0},{en:'Yes', sw:'Ndiyo', s:12}]},
 {g:'G3', key:'family', en:'Does anyone in your close family have endometriosis (mother, sister, aunt)?', sw:'Kuna mtu wa familia yako ya karibu mwenye endometriosis (mama, dada, shangazi)?', opts:[
   {en:'No / I don\'t know', sw:'Hapana / sijui', s:0},{en:'Yes', sw:'Ndiyo', s:10}]},
 {g:'G3', key:'prior', en:'Have you been treated for a pelvic condition before (e.g. PID, ovarian cyst, fibroids)?', sw:'Je umewahi kutibiwa ugonjwa wa fupanyonga (mf. PID, cyst ya ovari, fibroids)?', opts:[
   {en:'No / not sure', sw:'Hapana / sina uhakika', s:0},{en:'Yes', sw:'Ndiyo', s:3}]},
 {g:'G4', key:'impactDays', en:'In a typical month, how many days does pain stop you from normal activities?', sw:'Kwa mwezi wa kawaida, siku ngapi maumivu yanakuzuia shughuli za kawaida?', opts:[
   {en:'0 days', sw:'Siku 0', s:0},{en:'1–2 days', sw:'Siku 1–2', s:6},{en:'3–5 days', sw:'Siku 3–5', s:12},{en:'6 or more days', sw:'Siku 6 au zaidi', s:18}]},
 {g:'G4', key:'schoolWork', en:'How often does pain affect school or work?', sw:'Mara ngapi maumivu yanaathiri shule au kazi?', opts:[
   {en:'Never', sw:'Kamwe', s:0},{en:'Sometimes', sw:'Nyakati fulani', s:6},{en:'Often', sw:'Mara nyingi', s:12}]},
 {g:'G4', key:'sleep', en:'Does pain disturb your sleep?', sw:'Je maumivu yanauvuruga usingizi?', opts:[
   {en:'No', sw:'Hapana', s:0},{en:'Sometimes', sw:'Nyakati fulani', s:3},{en:'Often', sw:'Mara nyingi', s:6}]},
 {g:'G5', key:'sought', en:'Have you previously sought medical care for these symptoms?', sw:'Je umewahi kutafuta huduma ya afya kwa dalili hizi?', opts:[
   {en:'No', sw:'Hapana', s:0},{en:'Yes', sw:'Ndiyo', s:4}]},
 {g:'G5', key:'visits', en:'About how many healthcare visits for these symptoms?', sw:'Karibu ziara ngapi za afya kwa dalili hizi?', opts:[
   {en:'No visits yet', sw:'Bado hakuna', s:0},{en:'1–2 visits', sw:'Ziara 1–2', s:2},{en:'3–5 visits', sw:'Ziara 3–5', s:5},{en:'6 or more', sw:'6 au zaidi', s:8}]},
 {g:'G5', key:'told', en:'What explanation were you given before?', sw:'Ulipata maelezo gani hapo awali?', opts:[
   {en:'Nothing specific', sw:'Hakuna maalum', s:0},
   {en:'A common condition (e.g. malaria, typhoid, ulcers, stress)', sw:'Hali ya kawaida (mf. malaria, typhoid, ulcers, stress)', s:3},
   {en:'Possibly a pelvic condition', sw:'Huenda hali ya fupanyonga', s:2},
   {en:'Not sure', sw:'Sina uhakika', s:1}]},
 {g:'G5', key:'treated', en:'What treatment did you receive?', sw:'Matibabu gani uliyopewa?', opts:[
   {en:'None', sw:'Hakuna', s:0},{en:'Painkillers only', sw:'Painkillers tu', s:0},
   {en:'Hormonal treatment', sw:'Matibabu ya homoni', s:1},{en:'Other treatment', sw:'Nyingine', s:1}]},
 {g:'G5', key:'helped', en:'Did the treatment help?', sw:'Matibabu yalisaidia?', opts:[
   {en:'Not applicable', sw:'Hayahusiki', s:0},{en:'Yes, it helped', sw:'Ndiyo, ilisaidia', s:2},{en:'Little or no help', sw:'Kidogo au hakikusaidi', s:8}]},
 {g:'G5', key:'referred', en:'Were you ever referred to a specialist?', sw:'Je uliwahi kupelekwa kwa mtaalamu?', opts:[
   {en:'No', sw:'Hapana', s:0},{en:'Yes', sw:'Ndiyo', s:3}]}
];
const SAFETY = [
  {key:'s1', en:'Sudden, very severe pelvic or abdominal pain — different from your usual pain', sw:'Maumivu ya ghafla makali sana ya fupanyonga au tumbo — tofauti na kawaida yako'},
  {key:'s2', en:'Pelvic pain together with fever', sw:'Maumivu ya fupanyonga pamoja na homa'},
  {key:'s3', en:'Very heavy bleeding making you dizzy, faint or breathless', sw:'Damu nyingi sana zinazokufanya uzunguke, uzime au ukose pumzi'}
];
const GROUPS = {
  G1: {en:'A · Your pain', sw:'A · Maumivu yako'},
  G2: {en:'B · Associated symptoms', sw:'B · Dalili zinazohusiana'},
  G3: {en:'C · History & family', sw:'C · Historia na familia'},
  G4: {en:'D · How it affects your life', sw:'D · Jinsi inavyoathiri maisha yako'},
  G5: {en:'E · Your healthcare journey so far', sw:'E · Safari yako ya afya hadi sasa'}
};
const MAXW = QS.reduce((a,q)=>a+Math.max(...q.opts.map(o=>o.s)),0); // ≈189
let qIdx = 0;
const answers = {};
let pimaCtx = { mode:'self', label:null };
let pPhase='q', pStep=0;               // 'q' = questions, 's' = safety
function saveProgress(){ Store.set('ep_pima_progress', { phase:pPhase, step:pStep, answers:Object.assign({}, answers) }); }
function clearProgress(){ Store.del('ep_pima_progress'); }
function startPima(ctx){
  pimaCtx = ctx || { mode:'self', label:null };
  document.getElementById('result').style.display='none';
  if(pimaCtx.mode!=='self'){ beginPima(false); return; }   // CHP / village flows skip the calm pause
  updateResumeBox();
  document.getElementById('breathCard').style.display='none';
  document.getElementById('screener').style.display='none';
  document.getElementById('pimaIntro').style.display='block';
  window.scrollTo({top:0,behavior:'auto'});
}
function updateResumeBox(){
  const box=document.getElementById('resumeBox');
  const prog=Store.get('ep_pima_progress', null);
  if(prog && prog.answers && Object.keys(prog.answers).length>0){
    const total=QS.length+SAFETY.length;
    const step=Math.min((prog.step||0)+1, total);
    box.style.display='block';
    box.innerHTML=`<div class="note info" style="margin:0 0 12px">🌷 <b>${L('You have an unfinished check (question '+step+' of '+total+').','Una pima isiyokamilika (swali '+step+' kati ya '+total+').')}</b> ${L('Pick up where you left off, or start fresh — your choice.','Endelea pale ulipoishia, au anza upya — chaguo lako.')}
      <div class="qnav" style="margin-top:10px"><button class="btn btn-plum btn-sm" onclick="resumePima()">${L('Continue','Endelea')}</button><button class="btn btn-ghost btn-sm" onclick="freshPima()">${L('Start over','Anza upya')}</button></div></div>`;
  } else { box.style.display='none'; box.innerHTML=''; }
}
function freshPima(){
  const prog=Store.get('ep_pima_progress', null);
  const note=document.getElementById('breathNote');
  if(prog && prog.answers && Object.keys(prog.answers).length>0){
    note.style.display='block';
    note.innerHTML = L('You have an unfinished check — starting a new one will replace it.','Una pima isiyokamilika — kuanza upya kutaifuta.') +
      ` <button class="linkbtn" onclick="resumePima()" style="text-decoration:underline">${L('Continue it instead','Endelea nayo badala yake')}</button>`;
  } else { note.style.display='none'; note.innerHTML=''; }
  Object.keys(answers).forEach(k=>delete answers[k]);
  qIdx=0; pPhase='q'; pStep=0;
  document.getElementById('pimaIntro').style.display='none';
  document.getElementById('breathCard').style.display='block';
  window.scrollTo({top:0,behavior:'auto'});
}
function resumePima(){
  const prog=Store.get('ep_pima_progress', null);
  if(!prog || !prog.answers || !Object.keys(prog.answers).length){ freshPima(); return; }
  Object.keys(answers).forEach(k=>delete answers[k]);
  Object.assign(answers, prog.answers);
  beginPima(true);
  if(prog.phase==='s'){ renderSafety(Math.min(prog.step||0, SAFETY.length-1)); }
  else { qIdx=Math.min(prog.step||0, QS.length-1); renderQ(); }
}
function beginPima(resumed){
  document.getElementById('pimaIntro').style.display='none';
  document.getElementById('breathCard').style.display='none';
  document.getElementById('screener').style.display='block';
  document.getElementById('result').style.display='none';
  if(!resumed){ clearProgress(); Object.keys(answers).forEach(k=>delete answers[k]); qIdx=0; pPhase='q'; pStep=0; }
  const cn = document.getElementById('ctxNote');
  if(pimaCtx.mode==='chp'){ cn.style.display='block'; cn.innerHTML = `${L('Screening completed with a Community Health Promoter (demo workflow).','Uchunguzi umefanywa na Msaidizi wa Afya wa Jamii (mfumo wa mfano).')} <span class="badge b-proto">${L('PROTOTYPE','MFANO')}</span>`; }
  else if(pimaCtx.mode==='village'){ cn.style.display='block'; cn.innerHTML = `${L('Screening continued from Village Mode (USSD simulation).','Uchunguzi unaendelea kutoka Village Mode (mfumo wa USSD).')} <span class="badge b-proto">${L('SIMULATION','MFANO')}</span>`; }
  else cn.style.display='none';
  if(resumed){
    if(pPhase==='s') renderSafety(Math.min(pStep, SAFETY.length-1));
    else { qIdx=Math.min(pStep||qIdx, QS.length-1); renderQ(); }
  } else renderQ();
  document.getElementById('screener').scrollIntoView({behavior:'auto'});
}
function renderQ(){
  const total = QS.length + SAFETY.length;
  const q = QS[qIdx];
  const doneN = QS.filter(q2=>answers[q2.key]!==undefined).length;
  document.getElementById('prog').style.width = Math.round((qIdx/total)*100)+'%';
  document.getElementById('qnums').innerHTML = QS.map((qq,i)=>{
    const st = answers[qq.key]!==undefined ? 'done' : (i===qIdx ? 'cur' : '');
    return `<span class="${st}">${i+1}</span>`;
  }).join('');
  pPhase='q'; pStep=qIdx; saveProgress();
  const g = GROUPS[q.g];
  document.getElementById('qgroup').innerHTML = `<div class="qgroup">${L(g.en,g.sw)} · ${qIdx+1} / ${total}</div>`;
  document.getElementById('qbox').innerHTML =
    `<div class="q">${L(q.en,q.sw)}</div>` +
    q.opts.map((o,i)=>`<button class="opt${answers[q.key]===i?' sel':''}" onclick="pick(${i})"><span class="radio"></span><span>${L(o.en,o.sw)}</span></button>`).join('');
  document.getElementById('qprev').style.visibility = qIdx===0 ? 'hidden':'visible';
  const isLast = qIdx === QS.length-1;
  document.getElementById('qnext').textContent = isLast ? L('Finish →','Maliza →') : L('Next →','Endelea →');
}
function pick(i){
  answers[QS[qIdx].key]=i;
  document.querySelectorAll('#qbox .opt').forEach((b,j)=>b.classList.toggle('sel',j===i));
  setTimeout(()=>nextQ(), 200);
}
function nextQ(){
  if(answers[QS[qIdx].key]===undefined){ toast(L('Please choose an answer first.','Tafadhali chagua jibu kwanza.')); return; }
  if(qIdx < QS.length-1){ qIdx++; renderQ(); }
  else renderSafety(0);
}
function prevQ(){ if(qIdx>0){ qIdx--; renderQ(); } }
function renderSafety(i){
  safeI = i;
  pPhase='s'; pStep=i; saveProgress();
  const total = QS.length + SAFETY.length;
  document.getElementById('prog').style.width = Math.round(((QS.length+i)/total)*100)+'%';
  document.getElementById('qgroup').innerHTML = `<div class="qgroup" style="color:var(--red);border-color:var(--red)">${L('⚠️ Safety check — always analysed separately','⚠️ Ukaguzi wa usalama — huchambuliwa tofauti daima')} · ${QS.length+1+i} / ${total}</div>`;
  const s = SAFETY[i];
  document.getElementById('qbox').innerHTML =
    `<div class="q">${L(s.en, s.sw)}</div>` +
    `<button class="opt${answers[s.key]===0?' sel':''}" onclick="pickSafe(${i},0)"><span class="radio"></span><span>${L('No','Hapana')}</span></button>` +
    `<button class="opt${answers[s.key]===1?' sel':''}" onclick="pickSafe(${i},1)"><span class="radio"></span><span>${L('Yes','Ndiyo')}</span></button>` +
    `<div class="note info" style="margin-top:10px">${L('This section helps you know if you need urgent care. It is not a diagnosis and not a substitute for a clinician.','Sehemu hii inakusaidia kujua kama unahitaji huduma ya haraka. Si utambuzi wala mbadala wa daktari.')}</div>`;
  document.getElementById('qprev').style.visibility='visible';
  document.getElementById('qnext').textContent = i < SAFETY.length-1 ? L('Next →','Endelea →') : L('See my result →','Ona matokeo →');
}
function pickSafe(i,v){
  answers[SAFETY[i].key]=v;
  document.querySelectorAll('#qbox .opt').forEach((b,j)=>b.classList.toggle('sel',j===v));
  setTimeout(()=>{
    if(i < SAFETY.length-1) renderSafety(i+1);
    else showResult();
  }, 200);
}
function scoreCalc(){
  let sum = 0; const contrib=[];
  for(const q of QS){
    const v = answers[q.key]; if(v===undefined) continue;
    const o = q.opts[v]; sum += o.s;
    if(o.s >= 6) contrib.push({label: L(q.en,q.sw), v:o.s});
  }
  contrib.sort((a,b)=>b.v-a.v);
  return { score: Math.min(100, Math.round(100*sum/MAXW)), contrib: contrib.slice(0,6) };
}
function showResult(skip){
  const { score, contrib } = scoreCalc();
  const redFlags = SAFETY.filter(s=>answers[s.key]===1);
  const band = redFlags.length ? 'urgent' : (score>=60 ? 'high' : (score>=30 ? 'mod':'low'));
  const B = {
    low: {c:'var(--green)', bg:'var(--green-soft)', col:'#4F7E5B', ic:'🟢',
      t: L('LOW','CHINI'), v: L('Low','Chini'),
      en:'Right now, your answers describe symptoms that are not disrupting your everyday life much. That is worth knowing — and if things change, you can check again at any time.',
      sw:'Kwa sasa, majibu yako yanaonyesha dalili ambazo hazisumbui maisha yako ya kila siku sana. Ni vizuri kujua — na mambo yakibadilika, unaweza kupima tena wakati wowote.'},
    mod: {c:'var(--amber)', bg:'var(--amber-soft)', col:'#A06E2C', ic:'🟠',
      t: L('MODERATE','KATI'), v: L('Moderate','Kati'),
      en:'Your answers suggest your symptoms may be worth discussing with a healthcare professional. Many women wait until the pain is severe before asking — you do not have to.',
      sw:'Majibu yako yanaashiria dalili zako huenda zikastahili kujadiliwa na mtaalamu wa afya. Wanawake wengi hukungoja mpaka maumivu yawe makali kabla ya kuuliza — si lazima.'},
    high: {c:'var(--red)', bg:'var(--red-soft)', col:'#B45C50', ic:'🔴',
      t: L('HIGH','JUU'), v: L('High','Juu'),
      en:'Your answers suggest your symptoms deserve proper clinical assessment. This is a reason to seek care — not a diagnosis, and nothing to be ashamed of.',
      sw:'Majibu yako yanaashiria dalili zako zinastahili tathmini ya kimatibabu. Hii ni sababu ya kutafuta huduma — si utambuzi, wala si kitu cha kuonea aibu.'},
    urgent: {c:'#B95C66', bg:'#FBE5E5', col:'#B95C66', ic:'🚨',
      t: L('URGENT SAFETY FLAG','ALAMA YA DHARURA'), v: L('Urgent','Dharura'),
      en:'You reported a symptom that needs prompt medical attention. Please go to your nearest health facility or call for help now — before considering anything else on this page.',
      sw:'Umeripoti dalili inayohitaji huduma ya haraka. Tafadhali nenda kituo cha afya kilicho karibu au piga simu kwa msaada sasa — kabla ya kuangalia kingine chochote ukurasa huu.'}
  };
  const b = B[band];
  const flags = SAFETY.filter(s=>answers[s.key]===1)
    .map(s=>L(s.en,s.sw)).join(' · ');
  const contribs = contrib.length
    ? contrib.map(c=>`<li><b>${c.label}</b></li>`).join('')
    : `<li>${L('No answers pushed the score up — your symptom pattern is not showing red flags.','Hakuna jibu lililoinua alama — mfumo wako wa dalili hauonyeshi ishara za hatari.')}</li>`;
  const warnNote = band==='urgent' ? '' : `<p class="small" style="margin-top:10px">${L('If warning symptoms appear suddenly — very severe pain, pelvic pain with fever, or very heavy bleeding with dizziness — go to a health facility right away.','Iwapo dalili za hatari zitatokea ghafla — maumivu makali sana, maumivu ya fupanyonga na homa, au damu nyingi sana na kizunguzungu — nenda kituo cha afya sasa hivi.')}</p>`;
  const saved = { date:new Date().toISOString(), context:pimaCtx.mode, answers:Object.assign({}, answers), score, band, redFlags: flags, contrib: contrib.map(c=>c.label) };
  if(!skip){ API.screening.save(saved); clearProgress(); }
  document.getElementById('result').innerHTML = `
    ${band==='urgent' ? `<div class="flag urgent" style="background:#B95C66;color:#FFE3E3;font-size:1rem">🚨 ${b.t}</div>
    <div class="note danger"><b>${L('What you reported:','Ulichoripoti:')}</b> ${flags}</div>` : ''}
    <h3 style="color:var(--plum);font-size:1.2rem;font-family:Georgia,serif">${L('What your answers tell you','Majibu yako yanakuambia nini')}</h3>
    <div class="flag ${band}" style="background:${b.bg};color:${b.col}">${b.ic} ${b.t} — ${b.v}</div>
    <div class="nextsteps"><b>${L('In plain words:','Kwa maneno rahisi:')}</b><br>${L(b.en,b.sw)}</div>
    <div class="nextsteps"><b>${L('What you can do next','Utaweza kufanya nini baadaye')}</b>
      <ol style="margin:8px 0 0 20px;font-size:.9rem;color:var(--ink-soft)">
        <li>${L('Save your symptom summary (it stays on this device).','Hifadhi muhtasari wa dalili zako (unabaki kwenye kifaa hiki).')} <button class="btn btn-plum btn-sm" style="margin-left:6px" onclick="go('passport')">${L('My story','Hadithi yangu')}</button></li>
        <li>${L('Prepare your health story: symptoms, care so far, questions to ask.','Tayarisha hadithi yako ya afya: dalili, huduma uliyopata, maswali ya kuuliza.')} <button class="btn btn-ghost btn-sm" style="margin-left:6px" onclick="go('passport')">${L('Before you go','Kabla hujaenda')}</button></li>
        <li>${L('Find appropriate care near you (and what questions to ask).','Tafuta huduma sahihi karibu nawe (na maswali ya kuuliza).')} <button class="btn btn-ghost btn-sm" style="margin-left:6px" onclick="go('thibiti')">${L('Find care','Tafuta huduma')}</button></li>
        <li>${band==='urgent' ? L('Seek urgent care now — this comes first.','Tafuta huduma ya dharura sasa — hii ni ya kwanza.') : L('If warning symptoms appear, seek care immediately.','Iwapo dalili za hatari zitatokea, tafuta huduma mara moja.')}</li>
      </ol>
    </div>
    ${warnNote}
    <div style="margin-bottom:14px"><b style="font-size:.9rem">${L('What stood out in your answers','Kilichojitokeza kwenye majibu yako')}</b>
      <ul class="breakdown" style="font-size:.85rem;color:var(--ink-soft);margin:6px 0 0 18px">${contribs}</ul>
    </div>
    <p class="small" style="margin:4px 0 12px">${L('Indication score','Alama ya dalili')} <b style="color:var(--plum)">${score}/100</b> — ${L('a way to notice changes over time, not a grade and not a diagnosis.','njia ya kuona mabadiliko kadri muda unavyopita, si daraja wala si utambuzi.')}</p>
    <div class="negbox"><b>${L('What this does NOT mean','Hii haimaanishi nini')}</b><br>
      ${L('These symptoms can occur with endometriosis and with other conditions. Only a qualified healthcare professional can determine the cause. This is not a diagnosis, and the logic behind it is prototype decision-support — not clinically validated.','Dalili hizi zinaweza kutokea kwa endometriosis na hali nyingine. Ni mtaalamu wa afya aliyestahili tu anayeweza kujua sababu. Hii si utambuzi, na mantiki yake ni ya mfano — haijathibitishwa kimatibabu.')}</div>
    <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm" onclick="go('thibiti')">${L('Find appropriate care →','Tafuta huduma sahihi →')}</button>
      <button class="btn btn-plum btn-sm" onclick="go('passport')">${L('Build my story','Jenga hadithi yangu')}</button>
      <button class="btn btn-ghost btn-sm" onclick="go('journey')">${L('My journey','Safari yangu')}</button>
      <button class="btn btn-ghost btn-sm" onclick="startPima()" aria-label="${L('Check again','Pima tena')}">↺</button>
    </div>
    <p style="font-size:.72rem;color:var(--ink-soft);margin-top:12px">${L('Prototype decision-support logic — not clinically validated. Answers never leave this device.','Mantiki ya mfano wa uamuzi — haijathibitishwa kimatibabu. Majibu hayaachi kifaa hiki.')}</p>`;
  document.getElementById('screener').style.display='none';
  document.getElementById('result').style.display='block';
  if(!skip) document.getElementById('result').scrollIntoView({behavior:'smooth'});
}

/* =====================================================================
   UI — ENDO PASSPORT
===================================================================== */
let PASS = { timeline:[], syms:{}, imps:{}, care:[], invs:[] };
const SYMCATS = [
  ['pain','🩸',L('Menstrual pain','Maumivu ya mwezi')],
  ['bleed','🩸',L('Heavy / prolonged bleeding','Damu nyingi / ndefu')],
  ['bowel','🚽',L('Bowel symptoms (pain, diarrhoea)','Dalili za haja (maumivu, kuhara)')],
  ['urine','💧',L('Urinary symptoms','Dalili za mkojo')],
  ['sex','💞',L('Pain during sex','Maumivu ya ngono')],
  ['fatigue','😴',L('Fatigue','Uchovu')],
  ['bloat','🎈',L('Bloating','Kuvimba')],
  ['fert','🤰',L('Fertility concerns','Wasiwasi wa uzazi')]
];
const IMPCATS = [
  ['school','🎒',L('School','Shule')],
  ['work','💼',L('Work','Kazi')],
  ['sleep','🌙',L('Sleep','Usingizi')],
  ['relate','💛',L('Relationships','Mahusiano')],
  ['daily','🏠',L('Daily activities','Shughuli za kila siku')]
];
const passLabel = (id) => SYMCATS.find(s=>s[0]===id);
function loadPass(){ PASS = API.passport.load() || PASS; }
function savePass(){ API.passport.save(PASS); }
function renderPass(){
  loadPass();
  // timeline
  const tl = document.getElementById('tlList');
  tl.innerHTML = PASS.timeline.length
    ? PASS.timeline.map((e,i)=>`<div class="tl-item"><b>${L('Age','Umri')} ${esc(e.age)}</b><p>${esc(e.text)}</p>
       <div class="actions"><button class="linkbtn" onclick="rmTl(${i})">${L('Delete','Futa')}</button></div></div>`).join('')
    : `<p class="muted" style="font-size:.85rem">${L('No events yet — add the first one.','Hakuna matukio bado — ongeza ya kwanza.')}</p>`;
  // chips
  document.getElementById('symChips').innerHTML = SYMCATS.map(s=>
    `<button class="chip${PASS.syms[s[0]]?' sel':''}" onclick="togPass('syms','${s[0]}')">${s[1]} ${L(PASS.syms[s[0]]?'Marked:':'')}${s[2]}</button>`).join('');
  document.getElementById('impChips').innerHTML = IMPCATS.map(s=>
    `<button class="chip${PASS.imps[s[0]]?' sel':''}" onclick="togPass('imps','${s[0]}')">${s[1]} ${s[2]}</button>`).join('');
  // care
  document.getElementById('careList').innerHTML = PASS.care.length
    ? PASS.care.map((c,i)=>`<div class="entry"><div class="ic teal">🏥</div><div>
        <h4>${esc(c.facility)} <span class="tag">${esc(c.date||'')}</span></h4>
        <div class="meta">${esc(c.treat||'')}</div>
        <div class="meta">${L('Referral:','Rufaa:')} ${c.referral?L('Yes','Ndiyo'):L('No','Hapana')} · ${L('Response:','Mwitikio:')} ${esc(c.response||'—')}</div>
        <button class="linkbtn" onclick="rmCare(${i})">${L('Delete','Futa')}</button></div></div>`).join('')
    : `<p class="muted" style="font-size:.85rem">${L('No previous care recorded.','Hakuna huduma za awali.')}</p>`;
  // investigations
  document.getElementById('invList').innerHTML = PASS.invs.length
    ? PASS.invs.map((v,i)=>`<div class="entry"><div class="ic gold">🔬</div><div>
        <h4>${esc(L(v.type,'Aina'))} <span class="tag">${esc(v.date||'')}</span></h4>
        <div class="meta">${esc(v.note||'')}</div>
        <button class="linkbtn" onclick="rmInv(${i})">${L('Delete','Futa')}</button></div></div>`).join('')
    : `<p class="muted" style="font-size:.85rem">${L('No investigations recorded.','Hakuna uchunguzi uliorekodiwa.')}</p>`;
}
const invLabel = t => ({us:L('Ultrasound','Ultrasound'), mri:'MRI', lab:L('Laboratory test','Kipimo cha maabara'), surg:L('Surgery / laparoscopy','Upasuaji / laparoscopy'), other:L('Other','Nyingine')})[t] || t;
function togPass(kind,id){
  PASS[kind][id]=!PASS[kind][id]; savePass(); renderPass();
}
let tlEdit = -1;
function addTlEvent(){ tlEdit=-1; document.getElementById('tlAge').value=''; document.getElementById('tlText').value=''; document.getElementById('tlForm').style.display='block'; document.getElementById('tlAge').focus(); }
function cancelTl(){ document.getElementById('tlForm').style.display='none'; }
function saveTl(){
  const age = +document.getElementById('tlAge').value, text = document.getElementById('tlText').value.trim();
  if(!age || !text){ toast(L('Please fill in both age and what happened.','Tafadhali jaza umri na kilichotokea.')); return; }
  PASS.timeline.push({age,text}); PASS.timeline.sort((a,b)=>a.age-b.age); savePass(); cancelTl(); renderPass();
  toast(L('Event saved to your timeline.','Tukio limehifadhiwa.')); 
}
function rmTl(i){ PASS.timeline.splice(i,1); savePass(); renderPass(); }
function toggleCareForm(){ const f=document.getElementById('careForm'); f.style.display = f.style.display==='none'?'block':'none'; }
function saveCare(){
  const facility = document.getElementById('cfFacility').value.trim();
  if(!facility){ toast(L('Please name the facility.','Tafadhali jaza jina la kituo.')); return; }
  PASS.care.push({
    facility,
    date: document.getElementById('cfDate').value.trim(),
    referral: document.getElementById('cfRef').value==='yes',
    treat: document.getElementById('cfTreat').value.trim(),
    response: document.getElementById('cfResp').value || '—'
  });
  savePass(); toggleCareForm(); renderPass();
  toast(L('Care entry saved.','Ingizo limehifadhiwa.'));
}
function rmCare(i){ PASS.care.splice(i,1); savePass(); renderPass(); }
function saveInv(){
  const note = document.getElementById('invNote').value.trim();
  const type = invLabel(document.getElementById('invType').value);
  if(!note){ toast(L('Please write what you were told.','Tafadhali andika kile ulichoelezwa.')); return; }
  PASS.invs.push({type, date:new Date().toLocaleDateString(), note});
  savePass(); renderPass(); document.getElementById('invNote').value='';
  toast(L('Investigation recorded.','Uchunguzi umerekodiwa.'));
}
function rmInv(i){ PASS.invs.splice(i,1); savePass(); renderPass(); }
function prepAppt(){ document.getElementById('apptPrep').style.display='block'; document.getElementById('apptPrep').scrollIntoView({behavior:'smooth'}); }

/* ---------- clinician handoff ---------- */
function buildDocSum(){
  const scr = API.screening.latest();
  const bandTxt = scr ? ({low:L('LOW','CHINI'),mod:L('MODERATE','KATI'),high:L('HIGH','JUU'),urgent:L('URGENT — see below','DHARURA — ona chini')})[scr.band] : L('Not yet assessed','Bado haijapimwa');
  const durEl = PASS.timeline[0];
  const durTxt = durEl
    ? L(`Since about age ${durEl.age} (self-reported)`, `Tangu takriban umri wa ${durEl.age} (kujiripoti)`)
    : L('Self-reported; see timeline','Kujiripoti; ona safari ya dalili');
  const scrDur = scr ? '' : '';
  const symsNow = Object.keys(PASS.syms).filter(k=>PASS.syms[k]).map(k=>`• ${SYMCATS.find(s=>s[0]===k)[2]}`).concat(
    scr ? (scr.contrib||[]).filter(Boolean).map(c=>'• '+c) : []).slice(0,8);
  const impactNow = Object.keys(PASS.imps).filter(k=>PASS.imps[k]).map(k=>`• ${IMPCATS.find(s=>s[0]===k)[2]}`);
  const careN = PASS.care.length;
  const txt = [
    L('PATIENT-GENERATED ENDOMETRIOSIS SYMPTOM SUMMARY','MUHTASARI WA DALILI ZA ENDOMETRIOSIS — ULIOANDALIWA NA MGONJWA'),
    `${L('Date:','Tarehe:')} ${new Date().toLocaleDateString()}`,
    `${L('Primary concern:','Wasiwasi mkuu:')} ${L('Severe recurrent pelvic / menstrual pain (self-reported)','Maumivu makali ya fupanyonga / mishipa ya mwezi (kujiripoti)')}`,
    `${L('Symptom duration:','Muda wa dalili:')} ${durTxt}`,
    `${L('Functional impact:','Athari ya kufanya kazi:')} ${L('Reported at screening + passport; approx. days affected per month — see passport','Imeripotiwa kwenye pima + pasipoti; karibu siku zilizoathiriwa kwa mwezi — ona pasipoti')}`,
    `${L('Associated symptoms (self-reported):','Dalili zinazohusiana (kujiripoti):')}`,
    ...symsNow.map(s=>'  '+s),
    `${L('Previous care:','Huduma za awali:')} ${careN} ${L('healthcare visit(s) recorded','ziara za afya zilizorekodiwa')}`,
    `${L('Previous treatment (user-entered):','Matibabu ya awali (yaliyojazwa na mtumiaji):')}`,
    ...(PASS.care.length ? PASS.care.map(c=>`  • ${c.facility}: ${c.treat||'—'}`) : ['  —']),
    `${L('Investigations (user-entered, not verified):','Uchunguzi (unaojazwa na mtumiaji, haujathibitishwa):')}`,
    ...(PASS.invs.length ? PASS.invs.map(v=>`  • ${v.type}: ${v.note}`) : ['  —']),
    `${L('Current symptom-priority flag:','Alama ya sasa ya kipaumbele cha dalili:')} ${bandTxt}`,
    scr && scr.redFlags ? `${L('Safety flags reported:','Alama za usalama zilizoripotiwa:')} ${scr.redFlags}` : '',
    '',
    L('IMPORTANT: This is a patient-generated symptom summary prepared for discussion with a clinician. It does not constitute a diagnosis and was generated by prototype (not clinically validated) logic.','MUHIMU: Huu ni muhtasari wa dalili uliotengenezwa na mgonjwa kwa ajili ya kujadiliwa na daktari. Si utambuzi, ulitengenezwa na mantiki ya mfano (haijathibitishwa kimatibabu).'),
    L('EndoPima prototype v1.2 — education demo, not a medical device.','EndoPima prototype v1.2 — demo ya elimu, si kifaa cha matibabu.')
  ].filter(l=>l!=='').join('\n');
  document.getElementById('docSumBody').innerHTML = `<pre style="white-space:pre-wrap;font-family:inherit;font-size:.88rem;line-height:1.55">${esc(txt)}</pre>`;
  document.getElementById('docsum').innerHTML = document.getElementById('docSumBody').innerHTML; // printable copy
  document.getElementById('docModal').classList.add('show');
  document.getElementById('docModal').scrollTop = 0;
}
function closeDocModal(){ document.getElementById('docModal').classList.remove('show'); }
function printDocSum(){ document.body.classList.add('printing'); window.print(); setTimeout(()=>document.body.classList.remove('printing'),500); }
function dlDocSum(){
  const txt = document.getElementById('docSumBody').innerText;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([txt],{type:'text/plain'}));
  a.download = 'EndoPima_doctor_summary.txt'; a.click();
  toast(L('Download started (prototype file on this device).','Upakuaji umeanza (faili ya prototype kwenye kifaa hiki).'));
}
function shareDocSum(){
  const txt = document.getElementById('docSumBody').innerText;
  if(navigator.share){ navigator.share({title:'EndoPima doctor summary', text:txt}).catch(()=>toast(L('Share was cancelled.','Ushiriki umegheairiwa.'))); }
  else if(navigator.clipboard){ navigator.clipboard.writeText(txt).then(()=>toast(L('Copied — paste it into WhatsApp/SMS.','Imenakiliwa — bandika kwenye WhatsApp/SMS.'))).catch(()=>copyFallback(txt)); }
  else copyFallback(txt);
}
function copyFallback(txt){
  const ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); toast(L('Copied — paste it into WhatsApp/SMS.','Imenakiliwa — bandika kwenye WhatsApp/SMS.')); }catch(e){ toast(L('Could not copy automatically — please write the summary down.','Haikuweza kunakili moja kwa moja — tafadhali andika muhtasari.') ); }
  ta.remove();
}
/* =====================================================================
   UI — THIBITI (navigation + directory)
===================================================================== */
const NEEDINFO = {
  first: { level: L('Nearest Level 4–5 health facility, or your CHP','Kituo cha karibu cha kiwango 4–5, au CHP wako'),
    txt: L('Start with a clinical assessment. A clinician listens, examines and decides what evaluation is appropriate — imaging or a specialist only if needed.', 'Anza na tathmini ya kimatibabu. Daktari husikiliza, huchunguza na kuamua uchunguzi unaofaa — picha au mtaalamu tu pale inapobidi.') },
  gyn: { level: L('Level 5 gynaecology clinic / county referral','Kliniki ya gynecology ya kiwango 5 / rufaa ya kaunti'), txt: L('Gynaecology review is a reasonable next step when symptoms persist. Bring your Endo Passport and doctor summary.', 'Mapitio ya gynecology ni hatua inayofuata pale dalili zinapoendelea. Leta Pasipoti yako na muhtasari wa daktari.') },
  us: { level: L('Level 5 with ultrasound (trained sonographer)','Kiwango 5 chenye ultrasound (mwuguzi aliyezoezwa)'), txt: L('Ultrasound is often the first imaging step. A negative result does not rule everything out — the clinician interprets it.', 'Ultrasound mara nyingi ndiyo picha ya kwanza. Matokeo hasi hayaondoi kila kitu — daktari ndiye anayafasiri.') },
  spec: { level: L('Referral hub (e.g. KNH / MTRH) — specialist evaluation','Kituo cha rufaa (mf. KNH / MTRH) — tathmini ya mtaalamu'), txt: L('Specialist evaluation is appropriate when the clinician recommends it — usually after assessment and imaging.', 'Tathmini ya mtaalamu inafaa pale daktari anapoipendekeza — kwa kawaida baada ya tathmini na picha.') },
  fert: { level: L('Fertility clinic (referral or private)','Kliniki ya uzazi (rufaa au binafsi)'), txt: L('Fertility support is a specialised service; a referral from a clinician is the usual entry point.', 'Msaada wa uzazi ni huduma maalum; rufaa kutoka kwa daktari ndiyo mlango wa kawaida.') },
  pain: { level: L('Level 5 / pain clinic (concept)','Kiwango 5 / kliniki ya maumivu (dhana)'), txt: L('Pain management may include medication, physiotherapy and other approaches — decided with your clinician.', 'Usimamizi wa maumivu unaweza kujumuisha dawa, physiotherapy na njia nyingine — kuamuliwa na daktari wako.') },
  physio: { level: L('Level 5 if available (concept)','Kiwango 5 ikipatikana (dhana)'), txt: L('Pelvic-floor physiotherapy helps some people with pelvic pain. Ask your clinician whether it is appropriate for you.', 'Physiotherapy ya fupanyonga husaidia baadhi ya watu wenye maumivu ya fupanyonga. Uliza daktari wako kama inakufaa.') },
  psych: { level: L('Level 5 counselling services (concept)','Huduma za ushauri kiwango 5 (dhana)'), txt: L('Living with persistent pain is hard; psychological support is a legitimate part of care. No one should carry it alone.', 'Kuishi na maumivu ya kudumu ni vigumu; msaada wa kisaikolojia ni sehemu halali ya huduma. Hakuna anayepaswa kubeba peke yake.') },
  fu: { level: L('The facility that saw you before (or nearest Level 4)','Kituo kilichokuhudumia hapo awali (au kiwango 4 karibu)'), txt: L('Follow-up keeps the journey moving — review, adjust treatment, and plan the next step.', 'Ufuatiliaji huendeleza safari — pitia upya, rekebisha matibabu, na panga hatua inayofuata.') }
};
function genNav(){
  const county = document.getElementById('navCounty').value;
  const need = document.getElementById('navNeed').value;
  const info = NEEDINFO[need];
  const cdemo = DemoData.facilities.filter(f=>
    (f.c.toLowerCase()===county || f.c==='all') && (need==='first' ? f.t.includes('us') || f.t.includes('endonurse') : f.t.includes(needLabel(need))));
  const list = cdemo.length ? cdemo.slice(0,3) : DemoData.facilities.filter(f=>f.t.includes('us')).slice(0,3);
  document.getElementById('navResult').innerHTML = `
    <div class="note info" style="margin-top:12px"><b>${L('Your next step (illustrative):','Hatua yako inayofuata (mfano):')}</b> ${info.level}<br>${info.txt}</div>
    <div class="small" style="margin:8px 0">${L('Example facilities nearby (DEMONSTRATION DATA):','Vituo vya mfano karibu nawe (DATA YA MFANO):')}</div>
    ${list.map(f=>`<div class="entry"><div class="ic ${f.t.includes('us')?'teal':''}">🏥</div><div><h4>${esc(f.n)}</h4><div class="meta">${esc(f.l)} · ${esc(f.c)}</div>
      <span class="badge b-demo">DEMO</span></div></div>`).join('')}
    <p class="small" style="margin-top:8px">${L('A real system would show verified facilities and contact details. Always confirm availability before travelling.','Mfumo halisi ungeonyesha vituo vilivyothibitishwa na mawasiliano. Thibitisha upatikanaji kabla ya safari.')}</p>`;
}
function needLabel(n){ return {first:'endonurse', gyn:'surg', us:'us', spec:'surg', fert:'surg', pain:'us', physio:'us', psych:'us', fu:'us'}[n]; }
function renderClinics(){
  const fc = document.getElementById('fCounty').value, ft = document.getElementById('fType').value;
  const items = DemoData.facilities.filter(c=>(fc==='all'||c.c===fc)&&(ft==='all'||c.t.includes(ft)));
  const el = document.getElementById('clinicList');
  if(!items.length){ el.innerHTML = `<p class="muted">${L('No demo entries — try another region or service.','Hakuna vielelezo — jaribu mkoa au huduma nyingine.')}</p>`; return; }
  el.innerHTML = items.map(c=>`
    <div class="entry">
      <div class="ic ${c.t.includes('us')?'teal':''} ${c.t.includes('endonurse')?'gold':''}">${c.t.includes('endonurse')?'💊':(c.t.includes('surg')?'🔬':'🩻')}</div>
      <div>
        <h4>${c.n}</h4>
        <div class="meta">${c.l} · ${c.c}</div>
        <div class="tags" style="margin-top:5px;display:flex;gap:6px;flex-wrap:wrap">${c.t.map(t=>`<span class="tag ${t==='endonurse'?'t1':(t==='us'?'t3':'t2')}">${
          t==='endonurse'?L('EndoNurse clinic (concept)','Kliniki ya EndoNurse (dhana)'):
          t==='us'?L('Ultrasound','Ultrasound'):L('Gynaecology / specialist','Gynecology / mtaalamu')}</span>`).join('')}
          <span class="badge b-demo">DEMO</span></div>
      </div>
    </div>`).join('');
}

/* =====================================================================
   UI — FANYA
===================================================================== */
const costSel = new Set(['consult','imaging','labs']);
function renderFanya(){
  document.getElementById('costCats').innerHTML = DemoData.costCats.map(c=>`
    <div class="service ${costSel.has(c.id)?'sel':''}" onclick="togCost('${c.id}')">
      <div><b>${L(c.en,c.sw)}</b><span>KSh ${(c.lo/1000).toFixed(c.lo<2000?1:0)}k – ${(c.hi/1000).toFixed(c.hi>=100000?0:1)}k</span></div>
      <span class="badge b-demo">${L('ESTIMATE','MAKADIRIO')}</span></div>`).join('');
  renderCost();
  pkSync();
  document.getElementById('fundChips').innerHTML = DemoData.fundSources.map(f=>
    `<span class="tag" style="font-size:.78rem;padding:9px 13px">${f[0]} ${L(f[2], {individual:'Akiba binafsi',family:'Michango ya familia',employer:'Waajiri',sacco:'SACCO / chama',ngo:'NGO / misaada',financing:'Ufadhili wa afya'}[f[1]]||f[2])}</span>`).join('');
}
function togCost(id){ costSel.has(id)?costSel.delete(id):costSel.add(id); renderFanya(); }
function renderCost(){
  let lo=0, hi=0;
  DemoData.costCats.forEach(c=>{ if(costSel.has(c.id)){ lo+=c.lo; hi+=c.hi; } });
  document.getElementById('costLow').textContent='KSh '+lo.toLocaleString();
  document.getElementById('costHigh').textContent='KSh '+hi.toLocaleString();
  document.getElementById('costSha').textContent = costSel.has('surgery')
    ? L('Up to tariff — not guaranteed','Hadi kiwango — hakikisho halipo')
    : '—';
}
function pkSync(){
  const goal = +document.getElementById('pkGoal').value || 0;
  const cur = +document.getElementById('pkCurrent').value || 0;
  const mon = +document.getElementById('pkMonthly').value || 0;
  const slide = document.getElementById('pkSlide');
  if(+slide.value !== mon){ slide.value = mon; }
  const rem = Math.max(0, goal - cur);
  document.getElementById('pkRemain').textContent = 'KSh '+rem.toLocaleString();
  const m = mon>0 ? Math.ceil(rem/mon) : 0;
  document.getElementById('pkMonths').textContent = m ? m+' '+L('months','miezi') : L('— add a monthly amount','— weka kiasi cha mwezi');
  const scens = [
    [L('Just you','Wewe tu'), mon],
    [L('You + family KSh 2,500','Wewe + familia KSh 2,500'), mon+2500],
    [L('You + chama lump sum KSh 10,000','Wewe + chama KSh 10,000 (mkupuo)'), mon+10000]
  ];
  document.getElementById('pkScen').innerHTML = scens.map(s=>{
    const mm = s[1]>0 ? Math.ceil(rem/s[1]) : 0;
    return `<div class="entry" style="padding:10px"><div class="ic teal" style="width:36px;height:36px">💪</div><div><b style="font-size:.85rem">${s[0]}</b><div class="meta">KSh ${s[1].toLocaleString()}/mo → ${mm?mm+' '+L('months','miezi'):'—'}</div></div></div>`;
  }).join('');
}
['pkGoal','pkCurrent','pkMonthly'].forEach(id=>{
  document.getElementById(id).addEventListener('input', pkSync);
});
document.getElementById('pkSlide').addEventListener('input', e=>{ document.getElementById('pkMonthly').value=e.target.value; pkSync(); });

/* =====================================================================
   UI — OBSERVATORY
===================================================================== */
const FUNNEL_L = {
  screened:['Screened','Waliofanyiwa pima'], flagged:['Flagged high priority','Kipaumbele cha juu'],
  assessed:['Sought clinical assessment','Walitafuta tathmini'], imaged:['Received imaging','Walipata picha'],
  specialist:['Referred to specialist','Walioelekezwa mtaalamu'], assessedSpec:['Specialist assessment','Tathmini ya mtaalamu'],
  treated:['Entered treatment / follow-up','Waliingia matibabu / ufuatiliaji']
};
function renderObs(){
  const max = Math.max(...DemoData.funnel.map(f=>f[1]));
  document.getElementById('funnelBox').innerHTML = DemoData.funnel.map(f=>{
    const [k,v] = f; const [en,sw] = FUNNEL_L[k];
    return `<div class="frow"><div class="fl">${L(en,sw)}</div>
      <div class="fb"><div class="fi" style="width:${Math.max(6,(v/max*100)).toFixed(1)}%">${v.toLocaleString()}</div></div></div>`;
  }).join('') + `<p class="small" style="margin-top:8px"><span class="badge b-demo">DEMONSTRATION DATA</span></p>`;
  const gapL = [
    [L('Symptom onset','Mwanzo wa dalili')],
    [L('First healthcare visit','Ziara ya kwanza ya afya')],
    [L('First appropriate evaluation','Tathmini ya kwanza sahihi')],
    [L('Specialist referral','Rufaa ya mtaalamu')],
    [L('Specialist assessment','Tathmini ya mtaalamu')]
  ];
  document.getElementById('gapBox').innerHTML = gapL.map((g,i)=>`
    <div class="bar"><div class="lbl l" style="flex:1.4">${g[0]}</div>
      <div class="track" style="flex:2"><div class="fill" style="width:${i/gapL.length*100+8}%;background:${i%2?'var(--gold)':'var(--rose)'}"></div></div>
      <div class="val" style="text-align:right">${DemoData.careGap[i]} ${DemoData.careGap[i]?L('yrs','miaka'):''}</div></div>`).join('') +
    `<div class="flag mod" style="margin-top:8px">⏳ ${L('Reported care gap before specialist assessment: ≈7 years (patient-reported illustrative timeline — not an officially validated index)','Pengo la huduma kabla ya tathmini ya mtaalamu: ≈miaka 7 (safari ya mfano — si kipimo rasmi)')}</div>`;
  const ageMax = Math.max(...DemoData.ageDist.map(a=>a[1]));
  document.getElementById('ageBox').innerHTML = DemoData.ageDist.map(a=>`
    <div class="bar"><div class="lbl">${a[0]}</div><div class="track"><div class="fill" style="width:${(a[1]/ageMax*100).toFixed(0)}%"></div></div><div class="val">${a[1]}%</div></div>`).join('');
  const symMax = Math.max(...DemoData.symPattern.map(s=>s[1]));
  document.getElementById('symBox').innerHTML = DemoData.symPattern.map(s=>`
    <div class="bar"><div class="lbl" style="width:150px;text-align:left">${L(s[0]==='Maumivu makali ya mwezi'?'Severe period pain':s[0]==='Maumivu ya haja'?'Bowel pain':s[0]==='Damu nyingi'?'Heavy bleeding':s[0]==='Maumivu ya ngono'?'Pain during sex':'Fatigue', s[0])}</div>
      <div class="track"><div class="fill" style="width:${(s[1]/symMax*100).toFixed(0)}%;background:var(--teal)"></div></div><div class="val">${s[1]}%</div></div>`).join('');
  document.getElementById('impactBox').innerHTML = `
    <div class="bar"><div class="lbl l" style="width:220px">${L('Missed school/work days per month (self-reported, %)','Siku za shule/kazi zilizokosekwa kwa mwezi (kujiripoti, %)')}</div></div>
    ${DemoData.impact.days.map(b=>`
    <div class="bar"><div class="lbl l" style="width:60px">${b[0]} ${L('days','siku')}</div>
    <div class="track"><div class="fill" style="width:${b[1]*1.6}%;background:var(--gold)"></div></div><div class="val">${b[1]}%</div></div>`).join('')}
    <p class="small" style="margin-top:6px"><span class="badge b-demo">DEMO — USER-REPORTED CONCEPT</span></p>`;
  const demo = { 'Kiambu':true, 'Kisumu':true };
  document.getElementById('countyTable').querySelector('tbody').innerHTML =
    DemoData.counties.map(c=>{
      const isDemo = demo[c[0]];
      const na = `<td class="na">${L('Data not yet available','Data haipatikani bado')}</td>`;
      const dms = `<td><span class="badge b-demo">DEMO</span></td>`;
      return `<tr><td><b>${c[0]}</b>${isDemo?' <span class="badge b-demo">DEMO</span>':''}</td>${isDemo?dms+na:na+na}${na}${na}${na}</tr>`;
    }).join('');
}

/* =====================================================================
   UI — SHULE
===================================================================== */
function suGo(w){
  ['learn','quiz','scen','att'].forEach(x=>{ document.getElementById('su-'+x).style.display = x===w?'block':'none'; });
  ['sut-learn','sut-quiz','sut-scen','sut-att'].forEach(x=>document.getElementById(x).classList.toggle('active', x==='sut-'+w));
}
const QUIZ = [
  { q:{en:'Severe period pain that makes you miss school is normal.',sw:'Maumivu makali ya mwezi yanayokufanya ukose shule ni ya kawaida.'}, ans:false,
    exp:{en:'False. Pain that disrupts your life is a sign to be checked — not a weakness, and not "just cramps".',sw:'Si kweli. Maumivu yanayovuruga maisha yako ni ishara ya kuangaliwa — si udhaifu, wala si "cramps tu".'} },
  { q:{en:'Endometriosis only affects wealthy women.',sw:'Endometriosis huathiri wanawake matajiri pekee.'}, ans:false,
    exp:{en:'False. It can affect women of any income. This myth has itself delayed diagnosis in Kenya.',sw:'Si kweli. Inaweza kumathiri mwanamke wa kipato chochote. Hadithi hii imechelewesha utambuzi Kenya.'} },
  { q:{en:'A clinician can diagnose much of endometriosis with an ultrasound — without surgery.',sw:'Daktari anaweza kugundua sehemu kubwa ya endometriosis kwa ultrasound — bila upasuaji.'}, ans:true,
    exp:{en:'True — modern guidance recognises ultrasound/MRI for ovarian and deep disease without laparoscopy. Imaging still has limits.',sw:'Kweli — miongozo ya kisasa inatambua ultrasound/MRI kwa ugonjwa wa ovari na wa ndani bila laparoscopy. Picha bado zina mipaka.'} },
  { q:{en:'Having a baby cures endometriosis.',sw:'Kupata mtoto hutibu endometriosis.'}, ans:false,
    exp:{en:'False — pregnancy may temporarily ease symptoms but does not cure the disease.',sw:'Si kweli — ujauzito unaweza kupunguza dalili kwa muda lakini hautibu ugonjwa.'} },
  { q:{en:'94% of Kenyan teenagers surveyed had never heard the word "endometriosis".',sw:'94% ya vijana Kenya waliohojiwa hawajawahi kusikia neno "endometriosis".'}, ans:true,
    exp:{en:'True — another reason detection starts at school and household level.',sw:'Kweli — sababu nyingine ya utambuzi kuanza shuleni na nyumbani.'} },
  { q:{en:'A normal ultrasound always rules out endometriosis.',sw:'Ultrasound isiyo na tatizo daima huondoa endometriosis.'}, ans:false,
    exp:{en:'False. Imaging has important limitations; a clinician determines what evaluation is appropriate.',sw:'Si kweli. Picha zina mipaka muhimu; daktari huamua uchunguzi unaofaa.'} },
  { q:{en:'Period pain that keeps getting worse month after month deserves attention.',sw:'Maumivu ya mwezi yanayozidi mwezi baada ya mwezi yanastahili kuangaliwa.'}, ans:true,
    exp:{en:'True. Worsening patterns are exactly the kind of thing worth discussing with a clinician.',sw:'Kweli. Mifumo inayozidi ndiyo hasa inayostahili kujadiliwa na daktari.'} },
  { q:{en:'Endometriosis is contagious.',sw:'Endometriosis inaambukiza.'}, ans:false,
    exp:{en:'False. It is not infectious and nobody "catches" it. It is also not anyone\'s fault.',sw:'Si kweli. Haiambukizi na hakuna anayeipata kutoka kwa mtu. Wala si kosa la mtu.'} }
];
let quizIdx=0, quizScore=0, quizDone=false, quizPicked=null;
function quizRestart(){ quizIdx=0; quizScore=0; quizDone=false; renderQuiz(); }
function renderQuiz(){
  if(quizDone){
    document.getElementById('quizq').textContent = `${L('Your score','Alama yako')}: ${quizScore}/${QUIZ.length}`;
    document.getElementById('quizOpts').innerHTML='';
    document.getElementById('quizExp').style.display='block';
    document.getElementById('quizExp').innerHTML = `<div class="exp">${L('Thank you for learning!','Asante kwa kujifunza!')} ${quizScore===QUIZ.length?L('Perfect score 🎉','Alama kamili 🎉'):L('Read the explanations for the ones you missed.','Soma maelezo ya yale uliyokosea.')}</div>`;
    document.getElementById('quizRestart').style.display='inline-block';
    document.getElementById('quizNext').style.display='none';
    document.getElementById('qprog').style.width='100%';
    return;
  }
  const q=QUIZ[quizIdx];
  document.getElementById('qprog').style.width = (quizIdx/QUIZ.length*100)+'%';
  document.getElementById('quizq').textContent = `${quizIdx+1}. ${L(q.q.en,q.q.sw)}`;
  document.getElementById('quizOpts').innerHTML = `
    <button class="opt" onclick="pickQuiz(true)"><span class="radio"></span><span>${L('True','Kweli')}</span></button>
    <button class="opt" onclick="pickQuiz(false)"><span class="radio"></span><span>${L('False','Si kweli')}</span></button>`;
  document.getElementById('quizExp').style.display='none';
  document.getElementById('quizNext').style.display='none';
  document.getElementById('quizRestart').style.display='none';
}
function pickQuiz(v){
  const q=QUIZ[quizIdx]; quizPicked=v; if(v===q.ans) quizScore++;
  document.getElementById('quizOpts').innerHTML=`<div style="padding:6px 4px;font-weight:800;font-size:1.05rem;color:${v===q.ans?'var(--green)':'var(--red)'}">${v===q.ans?L('✅ Correct!','✅ Sahihi!'):L('❌ Not quite','❌ Si sahihi')}</div>`;
  document.getElementById('quizExp').style.display='block';
  document.getElementById('quizExp').innerHTML=`<div class="exp"><b>${q.ans?L('Correct answer: True','Jibu sahihi: Kweli'):L('Correct answer: False','Jibu sahihi: Si kweli')}</b><br>${L(q.exp.en,q.exp.sw)}</div>`;
  document.getElementById('quizNext').style.display='inline-block';
  document.getElementById('quizNext').textContent = quizIdx===QUIZ.length-1?L('See score →','Ona alama →'):L('Next →','Endelea →');
}
function quizNextFn(){ if(quizIdx<QUIZ.length-1){quizIdx++;renderQuiz();} else {quizDone=true;renderQuiz();} }
const SCEN = [
  { t:{en:'Amina, 15, misses school almost every month with severe cramps. Her mother says "period pain is normal". What should Amina do?',sw:'Amina, 15, anakosa shule karibu kila mwezi kwa cramps kali. Mama yake anasema "maumivu ya mwezi ni ya kawaida". Amina afanye nini?'},
    o:[
      {t:{en:'Endure it silently — it is just her lot',sw:'Vumilia kimya — ndiyo hali yake'}, good:false, f:{en:'Silence is exactly how years of suffering start. Her pain deserves attention, not endurance.',sw:'Ukimya ndivyo miaka ya mateso inavyoanza. Maumivu yake yanastahili kuangaliwa, si kuvumiliwa.'}},
      {t:{en:'Talk to a trusted adult AND get a clinical assessment',sw:'Zungumza na mtu mzima unayemwamini NA upate tathmini ya kimatibabu'}, good:true, f:{en:'Best move. Talking to a trusted adult and a clinician is how she gets answers — endometriosis is one possible cause among others.',sw:'Hatua bora. Kuzungumza na mtu mzima na daktari ndivyo anavyopata majibu — endometriosis ni sababu moja kati ya nyingine.'}},
      {t:{en:'Buy stronger painkillers from the shop every month',sw:'Nunua painkillers kali dukani kila mwezi'}, good:false, f:{en:'Self-medicating masks the problem and can be unsafe. A clinician should guide any medication.',sw:'Kujitia dawa huficha tatizo na inaweza kuwa hatari. Daktari ndiye aongoze dawa zozote.'}},
      {t:{en:'Leave school — the pain makes it impossible',sw:'Aache shule — maumivu yanaifanya isiwezekane'}, good:false, f:{en:'Leaving school is a huge cost. The right response to pain is care, not dropping out.',sw:'Kuaacha shule ni gharama kubwa. Jibu sahihi la maumivu ni huduma, si kuacha.'}}
    ]},
  { t:{en:'Faith, 17, has had heavy painful periods since 14, and her mother had endometriosis. She feels too embarrassed to tell anyone. What should Faith do?',sw:'Faith, 17, amekuwa na hedhi nzito zenye maumivu tangu 14, na mama yake alikuwa na endometriosis. Ana aibu kumwambia mtu. Faith afanye nini?'},
    o:[
      {t:{en:'Keep it to herself until it settles',sw:'Ajifiche mpaka ipungue'}, good:false, f:{en:'It rarely settles by itself. Family history is a good reason to talk to a clinician — not a diagnosis, just an important signal.',sw:'Mara nyingi haipungui yenyewe. Historia ya familia ni sababu nzuri ya kuongea na daktari — si utambuzi, ishara muhimu tu.'}},
      {t:{en:'Talk to a trusted adult (aunt, teacher, nurse) and seek assessment',sw:'Zungumza na mtu mzima unayemwamini (shangazi, mwalimu, muuguzi) na utafute tathmini'}, good:true, f:{en:'Exactly right. The shame belongs to the condition, not to Faith. Getting checked early changes everything.',sw:'Sahihi kabisa. Aibu ni ya hali hiyo, si ya Faith. Kuangaliwa mapema hubadilisha kila kitu.'}},
      {t:{en:'Assume she has endometriosis and start treatments herself',sw:'Ajidhani ana endometriosis na aanze matibabu mwenyewe'}, good:false, f:{en:'Self-diagnosis and self-treatment are risky. Only a clinician can determine what is going on.',sw:'Kujitambua na kujitibu ni hatari. Daktari pekee ndiye anayeweza kujua kilichopo.'}},
      {t:{en:'Pray it is not serious and stop thinking about it',sw:'Aombe isiwe mbaya na aache kufikiri'}, good:false, f:{en:'Ignoring persistent symptoms usually makes the journey longer. Seeking care is not lack of faith.',sw:'Kupuuza dalili hurefusha safari. Kutafuta huduma si ukosefu wa imani.'}}
    ]},
  { t:{en:'Aisha, 19, has a friend diagnosed with endometriosis who is terrified about "surgery". How should Aisha help?',sw:'Aisha, 19, ana rafiki aliyeugua endometriosis anayeogopa "upasuaji". Aisha amsaidie vipi?'},
    o:[
      {t:{en:'Tell her to refuse all treatment until she is sure',sw:'Amwambie akatae matibabu yote mpaka awe na hakika'}, good:false, f:{en:'Treatment decisions belong to her and her clinician. Scaring her into refusing everything is not support.',sw:'Uamuzi wa matibabu ni wake na daktari wake. Kumtisha akiwa na hofu si msaada.'}},
      {t:{en:'Support her to discuss options with a clinician — surgery is not always needed',sw:'Msindikize ajadili chaguzi na daktari — upasuaji si wa lazima kila mara'}, good:true, f:{en:'Perfect. Many people manage with medication, physiotherapy and follow-up. A clinician explains what is appropriate for her.',sw:'Sahihi. Watu wengi wanadhibitiwa na dawa, physiotherapy na ufuatiliaji. Daktari anaeleza kinachomfaa.'}},
      {t:{en:'Share the diagnosis with the whole friend group',sw:'Asambaze utambuzi kwa kundi zima la marafiki'}, good:false, f:{en:'Her health story is hers to share. That is a privacy boundary to respect.',sw:'Hadithi yake ya afya ni yake kushiriki. Hilo ni mpaka wa usiri wa kuheshimu.'}},
      {t:{en:'Buy her supplements she saw online that "cure" endometriosis',sw:'Amnunulie supplements aliyeona mtandaoni "zinazotibu" endometriosis'}, good:false, f:{en:'Miracle "cures" online are a red flag. Encourage her to follow her clinician\'s plan and ask questions.',sw:'"Tiba" za mtandaoni ni onyo jekundu. Mhimize afuate mpango wa daktari wake na aulize maswali.'}}
    ]}
];
let scenIdx=0, scenPicked=false;
function scenRestart(){ scenIdx=0; renderScen(); }
function renderScen(){
  if(scenIdx>=SCEN.length){
    document.getElementById('scenQ').textContent = L('That\'s the end — talk about these stories at school. 🎉','Hiyo ndiyo mwisho — jadilieni hadithi hizi shuleni. 🎉');
    document.getElementById('scenOpts').innerHTML='';
    document.getElementById('scenExp').style.display='none';
    document.getElementById('scenRestart').style.display='inline-block';
    document.getElementById('scenNext').style.display='none';
    return;
  }
  const s=SCEN[scenIdx];
  document.getElementById('scenQ').textContent = L(s.t.en,s.t.sw);
  document.getElementById('scenOpts').innerHTML = s.o.map((o,i)=>`<button class="opt" onclick="pickScen(${i})"><span class="radio"></span><span>${L(o.t.en,o.t.sw)}</span></button>`).join('');
  document.getElementById('scenExp').style.display='none';
  document.getElementById('scenNext').style.display='none';
  document.getElementById('scenRestart').style.display='none';
}
function pickScen(i){
  const s=SCEN[scenIdx], o=s.o[i];
  document.getElementById('scenOpts').innerHTML = `<div style="padding:6px 4px;font-weight:800;font-size:1rem;color:${o.good?'var(--green)':'var(--red)'}">${o.good?L('✅ Strongest choice','✅ Chaguo bora'):L('💡 Consider another option','💡 Fikiria chaguo jingine')}</div>`;
  document.getElementById('scenExp').style.display='block';
  document.getElementById('scenExp').innerHTML = `<div class="exp">${L(o.f.en,o.f.sw)}</div>`;
  document.getElementById('scenNext').style.display='inline-block';
  document.getElementById('scenNext').textContent = scenIdx===SCEN.length-1?L('Finish →','Maliza →'):L('Next story →','Hadithi inayofuata →');
}
function scenNextFn(){ scenIdx++; renderScen(); }
function saveAtt(){
  const d = +document.getElementById('attDays').value;
  if(isNaN(d)||d<0){ toast(L('Please enter a number of days (0–25).','Tafadhali ingiza idadi ya siku (0–25).')); return; }
  const key = new Date().toISOString().slice(0,7);
  let arr = API.att.load().filter(x=>x.m!==key);
  arr.push({m:key, d:Math.min(25,d)});
  arr.sort((a,b)=>a.m>b.m?1:-1);
  API.att.save(arr);
  renderAtt();
  toast(L('Saved on this device only.','Imehifadhiwa kwenye kifaa hiki tu.'));
}
function renderAtt(){
  const arr = API.att.load();
  document.getElementById('attList').innerHTML = arr.length
    ? arr.slice(-6).reverse().map(a=>`<div class="entry" style="padding:9px"><div class="ic teal" style="width:34px;height:34px">📅</div><div><b style="font-size:.85rem">${a.m}</b> — ${a.d} ${L('days affected','siku zilizoathiriwa')}</div></div>`).join('')
    : `<p class="muted" style="font-size:.83rem">${L('Nothing recorded yet.','Hakuna kilichorekodiwa bado.')}</p>`;
  const max = Math.max(5, ...arr.map(a=>a.d));
  document.getElementById('attViz').innerHTML = (arr.length?arr.slice(-6):[]).map(a=>`
    <div class="bar"><div class="lbl l" style="width:74px">${a.m}</div><div class="track"><div class="fill" style="width:${(a.d/max*100).toFixed(0)}%;background:var(--gold)"></div></div><div class="val">${a.d} d</div></div>`).join('')
    || `<p class="muted" style="font-size:.83rem">${L('Your chart will appear here.','Chati yako itaonekana hapa.')}</p>`;
}
/* =====================================================================
   UI — JAMII (village mode · CHP · dada)
===================================================================== */
function juGo(w){
  ['village','chp','dada'].forEach(x=>document.getElementById('ju-pane-'+x).style.display = x===w?'block':'none');
  ['ju-village','ju-chp','ju-dada'].forEach(x=>document.getElementById(x).classList.toggle('active', x==='ju-'+w));
}
/* ---- Village Mode (USSD simulation) ---- */
const VM = {
  topics: {
    period: { en:'Period pain that is severe or getting worse is worth checking. A clinician can help you understand it — it is not drama, and it is not something to endure silently. Reply 8 to try the symptom check, or 6 for care options.',
              sw:'Maumivu ya mwezi makali au yanayozidi yanastahili kuangaliwa. Daktari anaweza kukusaidia kuyaelewa — si mchezo, wala si ya kuvumilia kimya. Andika 8 kwa ukaguzi wa dalili, au 6 kwa chaguo za huduma.' },
    pelvic: { en:'Pelvic pain between periods, during sex, or with bowel movements can have several causes — a clinician can help find yours. Reply 8 to check your symptoms, or 6 for care options.',
              sw:'Maumivu ya fupanyonga kati ya hedhi, wakati wa ngono, au haja yanaweza kuwa na sababu nyingi — daktari anaweza kusaidia kupata yako. Andika 8 kwa ukaguzi wa dalili, au 6 kwa huduma.' },
    bleed: { en:'Very heavy or very long bleeding is worth discussing with a health worker, especially if you feel dizzy or breathless — that needs urgent care. If you are dizzy today, go to a facility now.',
              sw:'Damu nyingi sana au za muda mrefu zinastahili kujadiliwa na mfanyakazi wa afya, hasa kama unazunguka au unakosa pumzi — hiyo inahitaji huduma ya haraka. Kama unazunguka leo, nenda kituoni sasa.' },
    bowel: { en:'Pain during bowel movements around your period is a symptom worth mentioning to a clinician — it is common to feel shy, but health workers hear this every day.',
              sw:'Maumivu ya haja karibu na mwezi wako ni dalili inayostahili kumwambia daktari — ni kawaida kuona aibu, lakini wafanyakazi wa afya husikia hivi kila siku.' },
    sex: { en:'Pain during sex is a real health issue and there is help. It is not your fault and you are not alone. A clinician can help — you deserve comfortable, safe intimacy.',
            sw:'Maumivu ya ngono ni tatizo halisi la afya na kuna msaada. Si kosa lako na wewe si peke yako. Daktari anaweza kusaidia — unastahili mahusiano salama na raha.' },
    care: { en:'The care directory on the main app (Thibiti) shows example facilities and how to find your next step. In a real deployment, this menu would connect you to the nearest verified facility. Note: a full check is best done at Pima.',
            sw:'Orodha ya huduma kwenye app (Thibiti) inaonyesha vituo vya mfano na jinsi ya kupata hatua yako inayofuata. Katika utumizi halisi, menyu hii ingekuunganisha na kituo kilicho karibu kilichothibitishwa. Nota: ukaguzi kamili ni bora Pima.' },
    worker: { en:'Talk to your Community Health Promoter, school health staff, or the nearest facility. They can listen, advise, and help you decide on the right step. You can ask for a private conversation.',
              sw:'Zungumza na Msaidizi wako wa Afya wa Jamii, wafanyakazi wa afya shuleni, au kituo cha karibu. Wanaweza kusikiliza, kushauri, na kukusaidia kuamua hatua sahihi. Unaweza kuomba mazungumzo ya faragha.' },
    start: { en:'Welcome to EndoPima. This is a prototype simulation — no live USSD gateway is connected. Choose a topic to learn more.',
             sw:'Karibu EndoPima. Huu ni mfano wa prototype — hakuna USSD halisi iliyounganishwa. Chagua mada kujifunza zaidi.' }
  }
};
const vState = { screen:'lang', lang:null };
const vLog = [];
function vReset(){ vState.screen='lang'; vState.lang=null; vLog.length=0; }
function vLine(ent){ vLog.push(ent); vRender(); }
function vRender(){
  const el=document.getElementById('vTrans');
  el.innerHTML = vLog.map(e=>{
    if(e.t==='out') return `<div class="line out">&gt; ${e.n}</div>`;
    if(e.t==='topic'){ const x=VM.topics[e.k]; return `<div class="line in">${L(x.en,x.sw)}</div>`; }
    return `<div class="line ${e.cls||''}">${L(e.en,e.sw)}</div>`;
  }).join('');
  el.scrollTop=el.scrollHeight;
}
function vShow(screen){
  vState.screen=screen;
  if(screen==='lang'){
    vLine({t:'msg',en:'ENDOPIMA — Kupima Mapema. Choose language / Chagua lugha:',sw:'ENDOPIMA — Kupima Mapema. Chagua lugha:',cls:'brand'});
    vLine({t:'msg',en:'1. English',sw:'1. English',cls:'menu'});
    vLine({t:'msg',en:'2. Kiswahili',sw:'2. Kiswahili',cls:'menu'});
  } else if(screen==='main'){
    vLine({t:'msg',en:'What would you like help with?',sw:'Unahitaji msaada wa nini?',cls:'menu'});
    vLine({t:'msg',en:'1. Period pain',sw:'1. Maumivu ya mwezi',cls:'menu'});
    vLine({t:'msg',en:'2. Pelvic pain',sw:'2. Maumivu ya fupanyonga',cls:'menu'});
    vLine({t:'msg',en:'3. Heavy bleeding',sw:'3. Damu nyingi',cls:'menu'});
    vLine({t:'msg',en:'4. Pain during bowel movements',sw:'4. Maumivu ya haja',cls:'menu'});
    vLine({t:'msg',en:'5. Pain during sex',sw:'5. Maumivu ya ngono',cls:'menu'});
    vLine({t:'msg',en:'6. Find care',sw:'6. Tafuta huduma',cls:'menu'});
    vLine({t:'msg',en:'7. Talk to a health worker',sw:'7. Zungumza na mfanyakazi wa afya',cls:'menu'});
    vLine({t:'msg',en:'8. Full symptom check (opens Pima)',sw:'8. Ukaguzi kamili wa dalili (hufungua Pima)',cls:'menu'});
    vLine({t:'msg',en:'0. Repeat menu',sw:'0. Rudia menyu',cls:'menu'});
  }
}
function vTopic(k){
  vLine({t:'topic', k:k});
  vLine({t:'msg',en:'0. Repeat menu · 1–7. Topics · 8. Check',sw:'0. Rudia menyu · 1–7. Mada · 8. Pima',cls:'menu'});
  vState.screen='topic';
}
function vPress(n){
  if(vState.screen==='lang'){
    if(n===1){ vState.lang='en'; LANG='en'; vLine({t:'msg',en:'> English selected',sw:'> English selected',cls:'out'}); vShow('main'); }
    else if(n===2){ vState.lang='sw'; LANG='sw'; vLine({t:'msg',en:'> Kiswahili imechaguliwa',sw:'> Kiswahili imechaguliwa',cls:'out'}); vShow('main'); }
    return;
  }
  if(vState.screen==='main' || vState.screen==='topic'){
    vLine({t:'out', n:n});
    if(n===1) vTopic('period');
    else if(n===2) vTopic('pelvic');
    else if(n===3) vTopic('bleed');
    else if(n===4) vTopic('bowel');
    else if(n===5) vTopic('sex');
    else if(n===6) vTopic('care');
    else if(n===7) vTopic('worker');
    else if(n===8){ vLine({t:'msg',en:'Opening the symptom check in the app… (simulation continues there)',sw:'Inafungua ukaguzi wa dalili kwenye app… (mfumo unaendelea pale)',cls:'in'}); setTimeout(()=>{ go('pima'); startPima({mode:'village'}); }, 450); }
    else if(n===0) vShow('main');
  }
}
function vSend(){
  const v=document.getElementById('vInput').value.trim();
  if(!v) return;
  document.getElementById('vInput').value='';
  const n=parseInt(v.replace(/\D/g,''),10);
  if(!isNaN(n)) vPress(n);
}
function vPad(){
  const pad=document.getElementById('vPad');
  pad.innerHTML = [1,2,3,4,5,6,7,8,9,0].map(n=>`<button onclick="vPress(${n})">${n}</button>`).join('');
}
RENDER.jamii = () => { if(vLog.length===0){ vReset(); vShow('lang'); } else vRender(); renderCHP(); renderDada(); };

/* ---- CHP Mode ---- */
const CHP_STEPS = [
  ['👤','Identify','Tambua'], ['💬','Explain','Eleza'], ['✅','Consent','Ridhaa'], ['🩺','Screen','Pima'],
  ['🚦','Guidance','Mwongozo'], ['📄','Referral','Rufaa'], ['📞','Track','Fuatilia']
];
let chp = { step:0, house:null, consent:false, quick:{}, referral:null, status:null, reffs: Store.get('ep_chp_reffs', []) };
function renderCHP(){
  const st = document.getElementById('chpStepper');
  st.innerHTML = CHP_STEPS.map((s,i)=>`<button class="${i<chp.step?'done':i===chp.step?'on':''}" onclick="chpGo(${i})"><span class="n">${i+1}</span>${L(s[1],s[2])}</button>`).join('');
  const body = document.getElementById('chpStepBody');
  const H = chp.house;
  if(chp.step===0){
    body.innerHTML = `<b style="font-size:.9rem">${L('Step 1 — identify the household member','Hatua 1 — tambua mwanakaya')}</b>
      ${DemoData.roster.map((r,i)=>`<div class="service" onclick="chpHouse(${i})" style="${H===i?'border-color:var(--teal);background:var(--teal-soft)':''}"><b>${r.h}</b><span>${L(r.s==='Done'?'Screened':'Screening due', r.s==='Done'?'Amepimwa':'Pima inasubiri')} · ${L('Referral:','Rufaa:')} ${r.r}</span></div>`).join('')}`;
  } else if(chp.step===1){
    body.innerHTML = `<b style="font-size:.9rem">${L('Step 2 — explain the screening','Hatua 2 — eleza uchunguzi')}</b>
      <p class="small" style="margin:8px 0">${L('Read aloud (or adapt): "We are checking menstrual and pelvic pain as part of community health work. This is not a diagnosis — it helps us know if someone should see a clinician. You can stop at any time and the answers stay private. Do you have any questions?"','Soma kwa sauti (au rekebisha): "Tunakagua maumivu ya mwezi na fupanyonga kama sehemu ya kazi ya afya ya jamii. Huu si utambuzi — unatusaidia kujua kama mtu anapaswa kuonana na daktari. Unaweza kusimama wakati wowote na majibu yanabaki kuwa ya siri. Una maswali?"')}</p>
      <button class="btn btn-teal btn-sm" onclick="chpNext()">${L('Continue — explain given','Endelea — maelezo yametolewa')}</button>`;
  } else if(chp.step===2){
    body.innerHTML = `<b style="font-size:.9rem">${L('Step 3 — consent','Hatua 3 — ridhaa')}</b>
      <label style="display:flex;gap:10px;margin:10px 0;cursor:pointer;font-size:.9rem">
        <input type="checkbox" id="chpConsent" ${chp.consent?'checked':''} style="width:22px;height:22px;accent-color:var(--teal)" onchange="chp.consent=this.checked">
        <span>${L('She understands and agrees to be screened (recorded in this prototype only).','Ameelewa na anakubali kupimwa (inarekodiwa kwenye prototype hii tu).')}</span></label>
      <button class="btn btn-teal btn-sm" onclick="chpNext()">${L('Record consent and continue','Rekodi ridhaa na endelea')}</button>`;
  } else if(chp.step===3){
    body.innerHTML = `<b style="font-size:.9rem">${L('Step 4 — quick screening (4 questions)','Hatua 4 — ukaguzi wa haraka (maswali 4)')}</b>
      <p class="small">${L('A short version of the full Pima checklist. The CHP asks, the answers guide the referral decision.','Toleo fupi la orodha kamili ya Pima. CHP anauliza, majibu yanaongoza uamuzi wa rufaa.')}</p>
      ${[['sev', L('Period pain severity (0–3)','Ukali wa maumivu (0–3)')],
         ['days', L('Days affected per month (0–6+)','Siku zilizoathiriwa kwa mwezi (0–6+)')],
         ['bowel', L('Painful bowel movements (yes/no)','Maumivu ya haja (ndiyo/hapana)')],
         ['bleed', L('Very heavy bleeding (yes/no)','Damu nyingi sana (ndiyo/hapana)')]
      ].map((q,i)=>`<div style="margin-top:8px"><label class="small" style="font-weight:800">${q[1]}</label>
        <div class="qnums">${[0,1,2,3].slice(0, i>=2?2:4).map(v=>`<span class="${chp.quick[q[0]]===v?'cur':''}" style="cursor:pointer" onclick="chpQuick('${q[0]}',${v})">${v===0?L('No','Hapana'):i>=2?(v===1?L('Yes','Ndiyo'):''):v}</span>`).join('')}</div></div>`).join('')}
      <button class="btn btn-teal btn-sm" onclick="chpNext()">${L('Complete screening','Maliza ukaguzi')}</button>`;
  } else if(chp.step===4){
    const flag = chpFlag();
    body.innerHTML = `<b style="font-size:.9rem">${L('Step 5 — care-priority guidance','Hatua 5 — mwongozo wa kipaumbele')}</b>
      <div class="flag ${flag.cls}" style="margin-top:10px">${flag.ic} ${flag.txt}</div>
      <p class="small" style="margin-top:8px">${L('The CHP does not diagnose. Guidance helps decide whether to suggest a clinical visit.','CHP hatambui. Mwongozo husaidia kuamua kama kupendekeza ziara ya kliniki.')}</p>
      <button class="btn btn-teal btn-sm" onclick="chpNext()">${L('Show referral step','Onyesha hatua ya rufaa')}</button>`;
  } else if(chp.step===5){
    body.innerHTML = `<b style="font-size:.9rem">${L('Step 6 — generate referral','Hatua 6 — tengeneza rufaa')}</b>
      <div class="inputs" style="margin-top:8px">
        <label for="chpFac">${L('Refer to','Elekeza kwa')}</label>
        <select id="chpFac">${DemoData.facilities.filter(f=>f.c!=='all').slice(0,6).map(f=>`<option>${f.n}</option>`).join('')}</select>
        <label for="chpWhy">${L('Reason (short)','Sababu (fupi)')}</label>
        <input id="chpWhy" type="text" placeholder="${L('e.g. severe period pain, 4 days/month','mf. maumivu makali ya mwezi, siku 4/mwezi')}">
      </div>
      <button class="btn btn-teal btn-sm" style="margin-top:8px" onclick="chpRefer()">${L('Create referral','Tengeneza rufaa')}</button>`;
  } else {
    body.innerHTML = `<b style="font-size:.9rem">${L('Step 7 — track follow-up','Hatua 7 — fuatilia ufuatiliaji')}</b>
      <div style="margin-top:10px">${chp.reffs.length?chp.reffs.map((r,i)=>`
        <div class="entry" style="padding:9px"><div class="ic ${r.status==='failed'?'':''}" style="width:34px;height:34px">📄</div><div>
          <b style="font-size:.83rem">${esc(r.to)}</b><div class="meta">${esc(r.why||'')} · ${esc(r.date)}</div>
          <div class="actions" style="display:flex;gap:6px;margin-top:4px">
            <button class="linkbtn" onclick="chpStatus(${i},'pending')">${L('Pending','Inasubiri')}</button>
            <button class="linkbtn" onclick="chpStatus(${i},'completed')">${L('Completed','Imekamilika')}</button>
            <button class="linkbtn" onclick="chpStatus(${i},'failed')">${L('Did not attend','Hakufika')}</button>
          </div></div></div>`).join(''):`<p class="small">${L('No referrals created in this session.','Hakuna rufaa katika kikao hiki.')}</p>`}</div>
      <p class="small" style="margin-top:8px">${L('Failed or stale referrals appear as "Navigation follow-up needed" on dashboards.','Rufaa zilizoshindikana huonekana kama "Ufuatiliaji wa uelekezaji unahitajika" kwenye dashibodi.')}</p>`;
  }
  renderRoster();
}
function chpGo(i){ chp.step=i; renderCHP(); }
function chpNext(){ if(chp.step<6) chp.step++; renderCHP(); }
function chpHouse(i){ chp.house=i; renderCHP(); }
function chpQuick(k,v){ chp.quick[k]=v; renderCHP(); }
function chpFlag(){
  const q=chp.quick;
  const score = (q.sev||0) + (q.days||0) + (q.bowel||0)*1 + (q.bleed||0)*1;
  if(score>=5) return {cls:'high',ic:'🔴',txt:L('HIGH — suggest clinical assessment','JUU — pendekeza tathmini ya kliniki')};
  if(score>=3) return {cls:'mod',ic:'🟠',txt:L('MODERATE — discuss with a health professional','KATI — jadili na mtaalamu wa afya')};
  return {cls:'low',ic:'🟢',txt:L('LOW — education and monitoring','CHINI — elimu na ufuatiliaji')};
}
function chpRefer(){
  const to = document.getElementById('chpFac').value;
  const why = document.getElementById('chpWhy').value;
  chp.reffs.unshift({to, why, date:new Date().toLocaleDateString('en-KE'), status:'pending'});
  Store.set('ep_chp_reffs', chp.reffs);
  chp.step=6; renderCHP();
  toast(L('Referral created (prototype).','Rufaa imetengenezwa (prototype).'));
}
function chpStatus(i,s){ chp.reffs[i].status=s; Store.set('ep_chp_reffs', chp.reffs); renderCHP(); }
function renderRoster(){
  const rows = DemoData.roster.map(r=>{
    const st = r.st==='none' ? `<span class="tag">${L('Not referred','Hajaelekezwa')}</span>`
      : r.st==='pending' ? `<span class="tag t2">${L('Pending','Inasubiri')}</span>`
      : r.st==='completed' ? `<span class="tag t1">${L('Completed','Imekamilika')}</span>`
      : `<span class="tag" style="background:var(--red-soft);color:var(--red)">${L('Follow-up needed','Ufuatiliaji unahitajika')}</span>`;
    return `<tr><td><b>${r.h}</b></td><td>${r.s==='Done'?L('Done','Imefanyika'):L('Due','Inasubiri')}</td><td>${r.r}</td><td>${st}</td></tr>`;
  }).join('');
  document.getElementById('chpRoster').innerHTML = rows;
  const flags = DemoData.roster.filter(r=>r.st==='failed').length + chp.reffs.filter(r=>r.status==='failed'||r.status==='pending').length;
  document.getElementById('chpFlags').innerHTML = flags
    ? `<b>🚩 ${L('Navigation follow-up needed:','Ufuatiliaji wa uelekezaji unahitajika:')} ${flags}</b><br><span class="small">${L('These households need a call, a visit or a re-referral. This is the "did they actually get there?" layer. (Demo)','Kaya hizi zinahitaji simu, ziara au rufaa mpya. Hii ndiyo tabaka la "je walifika kweli?" (Mfano)')}</span>`
    : `<span class="small">${L('No navigation flags in this demo set.','Hakuna alama za uelekezaji katika mfano huu.')}</span>`;
}
/* ---- Dada Navigator ---- */
const DADA = {
  hello: { en:'Jambo! I\'m your Dada Navigator — a trained peer supporter. I\'m not a doctor, and I never replace clinical care, but I can walk beside you through the system. How can I help?',
    sw:'Jambo! Mimi ni Dada Navigator wako — msaidizi wa rika aliyefunzwa. Mimi si daktari, na siwezi kuchukua nafasi ya huduma ya kliniki, lakini naweza kutembea nawe katika mfumo. Nikusaidiaje?' },
  next: { en:'Great choice. Your next step depends on your symptom check. I can take you to the care navigator (Thibiti) — it asks where you are and what kind of help you need, then shows example facilities. Would you like that?',
    sw:'Chaguo nzuri. Hatua yako inayofuata inategemea ukaguzi wako. Naweza kukupeleka kwa mwelekezaji wa huduma (Thibiti) — unajibu uko wapi na unahitaji msaada gani, kisha inaonyesha vituo vya mfano. Ungependa?' },
  prep: { en:'Preparing well saves time. In your Passport there is a checklist: bring your timeline, previous results, medicine list and questions. Ask what could be causing the symptoms, what investigations fit, what the options are, what to do if it continues, and when to come back.',
    sw:'Kujitayarisha vizuri huokoa muda. Katika Pasipoti yako kuna orodha: leta safari yako ya dalili, matokeo ya awali, orodha ya dawa na maswali. Uliza nini kinaweza kusababisha dalili, uchunguzi upi unafaa, chaguo ni gani, nini cha kufanya zikiendelea, na nini kurudi lini.' },
  referral: { en:'A referral means a clinician has asked you to see someone more specialised. It usually needs: a referral letter, an appointment at the receiving facility, and your documents. If it is taking long or you were turned away — tell me, that is a "stuck" signal and we handle it together.',
    sw:'Rufaa inamaanisha daktari amekutaka umuone mtaalamu zaidi. Kwa kawaida inahitaji: barua ya rufaa, miadi kituoni, na nyaraka zako. Ikichukua muda au ukakataliwa — niambie, hiyo ni ishara ya "kukwama" nasi tunaishughulikia pamoja.' },
  finance: { en:'Money is a real barrier and it is okay to say so. Start with written prices, ask about SHA coverage, and plan savings with PimaPocket — a little each week like a chama. I can open the cost planner for you.',
    sw:'Pesa ni kizuizi halisi na ni sawa kukisema. Anza na bei kwa maandishi, uliza kuhusu SHA, na panga akiba na PimaPocket — kidogo kila wiki kama chama. Ninaweza kukufungulia mpangaji wa gharama.' },
  follow: { en:'Follow-up is how we know care is working. After your visit, tell me: is the pain better, the same or worse? Are you back at school or work? Did you get the care you expected? If anything is stuck, that is not your failure — it is a signal for us to act.',
    sw:'Ufuatiliaji ndivyo tunavyojua kama huduma inafanya kazi. Baada ya ziara yako, niambie: maumivu yamepungua, yamebaki au yamezidi? Umerudi shule au kazi? Ulipata huduma uliyotarajia? Kitu kikikwama, si kosa lako — ni ishara ya sisi kuchukua hatua.' },
  emotional: { en:'I hear you. Living with pain no one can see is exhausting — and it is not weakness to say so. Peer groups like Endo Sisters East Africa hold meet-ups; talking with women who understand is incredibly healing. You do not carry this alone.',
    sw:'Nakusikiliza. Kuishi na maumivu yasiyoonekana ni kuchosha — na si udhaifu kusema hivyo. Vikundi vya rika kama Endo Sisters East Africa hukutana; kuzungumza na wanawake wanaoelewa huponya sana. Hubeba hii peke yako.' }
};
function esc(s){ return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
const dadaLog = [];
const DADA_BTNS = {
  next: ['thibiti', L('Open care navigator','Fungua mwelekezaji')],
  prep: ['passport', L('Open appointment prep','Fungua maandalizi ya miadi')],
  finance: ['fanya', L('Open cost planner','Fungua mpangaji wa gharama')],
  follow: ['journey', L('Open my journey','Fungua safari yangu')]
};
const DADA_CHIPS = [
  ['next', '🧭 What is my next step?', '🧭 Hatua yangu inayofuata ni ipi?'],
  ['prep', '📘 Prepare for an appointment', '📘 Nitayarishe kwa miadi'],
  ['finance', '💰 Costs & financing', '💰 Gharama na ufadhili'],
  ['follow', '💬 Follow-up check-in', '💬 Ukaguzi wa ufuatiliaji'],
  ['emotional', '🌸 I need support', '🌸 Nahitaji msaada']
];
function dadaRender(){
  const chat=document.getElementById('dadaChat');
  chat.innerHTML = dadaLog.map(e=>{
    if(e.t==='u') return `<div class="bubble you">${esc(L(e.en,e.sw))}</div>`;
    const d=DADA[e.k]; const b=DADA_BTNS[e.k];
    return `<div class="bubble dada">${esc(L(d.en,d.sw))}${b?`<div class="acts"><button onclick="go('${b[0]}')">${esc(b[1])}</button></div>`:''}</div>`;
  }).join('') + `<div class="dada-chips">${DADA_CHIPS.map(c=>`<button onclick="dadaAsk('${c[0]}')">${esc(L(c[1],c[2]))}</button>`).join('')}</div>`;
  chat.scrollTop=chat.scrollHeight;
}
function dadaSay(key, byUser){
  if(byUser){ dadaLog.push({t:'u', en:DADA[key].en, sw:DADA[key].sw}); dadaRender(); return; }
  setTimeout(()=>{ dadaLog.push({t:'d', k:key}); dadaRender(); }, 700);
}
function dadaAsk(key){ dadaSay(key, true); setTimeout(()=>dadaSay(key), 150); }
function dadaGreet(){ dadaLog.length=0; dadaSay('hello'); }
function renderDada(){
  const chat=document.getElementById('dadaChat');
  if(!chat.dataset.init){ chat.dataset.init='1'; dadaLog.length=0; dadaSay('hello'); }
  else dadaRender();
}

/* =====================================================================
   UI — MY JOURNEY
===================================================================== */
const JOUR = { appts:[], reffs:[] };
function loadJour(){ const j=API.journey.load(); JOUR.appts=j.appts||[]; JOUR.reffs=j.reffs||[]; }
function saveJour(){ API.journey.save(JOUR); }
function renderJourney(){
  loadJour();
  const scr = API.screening.latest();
  const steps = [
    ['PIMA', !!scr],
    ['THIBITI', JOUR.appts.length>0 || JOUR.reffs.length>0],
    ['FANYA', !!Store.get('ep_costflag', null)],
    ['FOLLOW-UP', (API.journey.load().fus||[]).length>0]
  ];
  document.getElementById('jStage').innerHTML = `<div class="chips">${steps.map(s=>`
    <span class="chip ${s[1]?'sel':''}" style="${s[1]?'background:var(--green);border-color:var(--green)':''}">${s[0]} ${s[1]?'✓':''}</span>`).join('')}</div>
    <p class="small" style="margin-top:8px">${loadJourn && (JOUR.appts.length||JOUR.reffs.length) ? L('Milestones recorded on this device.','Hatua zilizorekodiwa kwenye kifaa hiki.') : L('This dashboard fills in as you use the platform.','Dashibodi hii hujaa unapotumia mfumo.')}</p>`;
  const flagMap = { low:['🟢 '+L('LOW','CHINI'),'var(--green-soft)','#4F7E5B'], mod:['🟠 '+L('MODERATE','KATI'),'var(--amber-soft)','#A06E2C'],
    high:['🔴 '+L('HIGH','JUU'),'var(--red-soft)','#B45C50'], urgent:['🚨 '+L('URGENT','DHARURA'),'#FBE5E5','#B95C66'] };
  document.getElementById('jFlag').innerHTML = scr
    ? `<div class="flag" style="background:${flagMap[scr.band][1]};color:${flagMap[scr.band][2]}">${flagMap[scr.band][0]} · ${scr.score}/100</div>
       <p class="small">${L('From your last Pima check on','Kutoka pima yako ya mwisho ya')} ${scr.date?new Date(scr.date).toLocaleDateString():'—'} · <span class="badge b-proto">${L('NOT A DIAGNOSIS','SI UTAMBUZI')}</span></p>`
    : `<p class="small">${L('Take Pima to get your flag.','Fanya Pima kupata alama yako.')}</p>`;
  const nextTxt = !scr ? L('Start with Pima — it takes 3 minutes.','Anza na Pima — inachukua dakika 3.')
    : scr.band==='urgent' ? L('Seek medical attention now — see the safety note on your result.','Tafuta huduma ya haraka sasa — ona noti ya usalama kwenye matokeo yako.')
    : scr.band==='high' ? L('Arrange a clinical assessment — use Thibiti → Find my next step.','Panga tathmini ya kimatibabu — tumia Thibiti → Tafuta hatua inayofuata.')
    : scr.band==='mod' ? L('Consider discussing symptoms with a health professional; prepare with your Passport.','Fikiria kujadili dalili na mtaalamu wa afya; jitayarishe na Pasipoti yako.')
    : L('Continue monitoring. Re-check if symptoms change.','Endelea kufuatilia. Pima tena dalili zikibadilika.');
  document.getElementById('jNext').textContent = nextTxt;
  // appointments
  const al = document.getElementById('apptList');
  al.innerHTML = JOUR.appts.length ? JOUR.appts.map((a,i)=>`
    <div class="entry"><div class="ic teal">📅</div><div><h4>${esc(a.date)} — ${esc(L(a.type,'Aina'))}</h4><div class="meta">${esc(a.place)}</div>
      <button class="linkbtn" onclick="rmAppt(${i})">${L('Delete','Futa')}</button></div></div>`).join('')
    : `<p class="muted" style="font-size:.85rem">${L('No appointments recorded.','Hakuna miadi iliyorekodiwa.')}</p>`;
  // referrals
  const reffs = JOUR.reffs.length ? JOUR.reffs : [ {to:L('Kiambu Level 5 (demo referral)','Kiwango 5 Kiambu (rufaa ya mfano)'), why:L('High symptom flags at Pima','Alama za juu za dalili kwenye Pima'), date:L('demo','mfano'), status:'pending', demo:true} ];
  document.getElementById('jReffs').innerHTML = reffs.map(r=>`
    <div class="entry"><div class="ic ${r.status==='completed'?'teal':(r.status==='pending'?'gold':'')}">📄</div><div>
      <h4>${esc(r.to)}</h4><div class="meta">${esc(r.why||'')} · ${esc(r.date)}</div>
      <span class="tag ${r.status==='completed'?'t1':(r.status==='pending'?'t2':'')}" style="background:${r.status==='failed'?'var(--red-soft)':''};color:${r.status==='failed'?'var(--red)':''}">${
        r.status==='completed'?L('Completed','Imekamilika'):r.status==='failed'?L('Did not attend','Hakufika'):L('Pending','Inasubiri')}${r.demo?' · DEMO':''}</span></div></div>`).join('');
  renderFU();
  renderStuck();
}
let loadJourn = true;
function toggleApptForm(){ const f=document.getElementById('apptForm'); f.style.display=f.style.display==='none'?'block':'none'; }
function saveAppt(){
  const date=document.getElementById('apDate').value, place=document.getElementById('apPlace').value.trim();
  if(!date||!place){ toast(L('Please add a date and facility.','Tafadhali jaza tarehe na kituo.')); return; }
  JOUR.appts.push({date, place, type:document.getElementById('apType').value});
  saveJour(); toggleApptForm(); renderJourney();
  toast(L('Appointment saved (this device).','Miadi imehifadhiwa (kifaa hiki).'));
}
function rmAppt(i){ JOUR.appts.splice(i,1); saveJour(); renderJourney(); }
const FQ = [
  ['pain', L('Is your pain better, the same or worse?','Maumivu yamepungua, yamebaki au yamezidi?'), ['better','same','worse'], ['🟢','🟡','🔴']],
  ['life', L('Are you able to attend school/work?','Unaweza kwenda shule/kazi?'), ['yes','sometimes','no'], ['🟢','🟡','🔴']],
  ['care', L('Did you receive the care you expected?','Ulipata huduma uliyotarajia?'), ['yes','partly','no'], ['🟢','🟡','🔴']],
  ['help', L('Do you need help with the next step?','Unahitaji msaada na hatua inayofuata?'), ['yes','no'], ['🟡','🟢']]
];
function renderFU(){
  const f=document.getElementById('fuForm');
  f.innerHTML = FQ.map((q,qi)=>`<div style="margin-bottom:12px"><label class="small" style="font-weight:800;display:block;margin-bottom:5px">${q[0]==='help'&&qi===3?'❓ ':''}${q[1]}</label>
    <div class="chips">${q[2].map((o,oi)=>`<button class="chip" data-fq="${q[0]}" data-fv="${o}" onclick="fuPick(this)">${q[3][oi]} ${L(o, {better:'Imepungua',same:'Imebaki',worse:'Imezidi',yes:'Ndiyo',sometimes:'Nyakati fulani',no:'Hapana',partly:'Kiasi'}[o]||o)}</button>`).join('')}</div></div>`).join('') +
    `<button class="btn btn-primary btn-sm" onclick="fuSave()">${L('Save check-in','Hifadhi ukaguzi')}</button>`;
  const fus=API.journey.load().fus||[];
  document.getElementById('fuHist').innerHTML = fus.length
    ? fus.slice(-4).reverse().map(fu=>{
        const w=fu.ans.pain==='worse'||fu.ans.care==='no'||fu.ans.help==='yes';
        return `<div class="entry" style="padding:9px"><div class="ic ${w?'':'teal'}" style="width:34px;height:34px">${w?'🚩':'💬'}</div>
          <div><b style="font-size:.82rem">${new Date(fu.date).toLocaleDateString()}</b>
          <div class="meta">${[fu.ans.pain,fu.ans.life,fu.ans.care,fu.ans.help].map(v=>L(v||'—',{better:'Imepungua',same:'Imebaki',worse:'Imezidi',yes:'Ndiyo',sometimes:'Nyakati fulani',no:'Hapana',partly:'Kiasi'}[v]||v||'—')).join(' · ')}</div></div></div>`;
      }).join('')
    : `<p class="muted" style="font-size:.83rem">${L('No check-ins yet.','Hakuna ukaguzi bado.')}</p>`;
}
function fuPick(btn){
  const q=btn.dataset.fq, v=btn.dataset.fv;
  document.querySelectorAll(`[data-fq="${q}"]`).forEach(b=>b.classList.toggle('sel', b===btn));
  btn.dataset.on=1;
}
function fuSave(){
  const fus=API.journey.load().fus||[];
  const ans={};
  document.querySelectorAll('#fuForm .chip[data-on]').forEach(b=>ans[b.dataset.fq]=b.dataset.fv);
  if(!ans.pain){ toast(L('Please answer at least the pain question.','Tafadhali jibu angalau swali la maumivu.')); return; }
  fus.push({date:new Date().toISOString(), ans});
  API.journey.save({appts:JOUR.appts, reffs:JOUR.reffs, fus});
  toast(L('Check-in saved.','Ukaguzi umehifadhiwa.'));
  renderFU(); renderStuck();
}
function renderStuck(){
  const fus=API.journey.load().fus||[];
  const reffs=JOUR.reffs.length?JOUR.reffs:[{status:'pending'}];
  const stuck=[]; const fu=fus[fus.length-1];
  if(fu){
    if(fu.ans.pain==='worse') stuck.push(L('Symptoms reported as worse','Dalili zimeripotiwa kuzidi'));
    if(fu.ans.care==='no') stuck.push(L('Expected care not received','Huduma iliyotarajiwa haijapokelewa'));
    if(fu.ans.help==='yes') stuck.push(L('Needs help with next step','Anahitaji msaada na hatua inayofuata'));
  }
  if(reffs.some(r=>r.status==='pending'||r.status==='failed')) stuck.push(L('Referral not completed','Rufaa haijakamilika'));
  document.getElementById('jStuck').innerHTML = stuck.length
    ? `<div class="note danger" style="margin-top:12px"><b>🚩 NAVIGATION FOLLOW-UP NEEDED</b><br><span class="small"><ul style="margin:6px 0 0 18px">${stuck.map(s=>`<li>${s}</li>`).join('')}</ul>${L('A Dada Navigator (concept) would reach out and unblock the journey. This is the difference between showing a hospital and making sure you got there.','Dada Navigator (dhana) angewasiliana na kuondoa kizuizi. Huu ndio msingi kati ya kuonyesha hospitali na kuhakikisha umefika.')}</span></div>`
    : `<div class="note info" style="margin-top:12px">${L('Nothing flagged as stuck right now.','Hakuna kilichobainika kama kikwamo sasa hivi.')}</div>`;
}

/* =====================================================================
   UI — MORE (evidence, research, consent, privacy)
===================================================================== */
function renderMore(){
  const res=API.research.load();
  document.getElementById('resYes').classList.toggle('sel', res===true);
  document.getElementById('resNo').classList.toggle('sel', res===false);
  const c=API.consent.load()||{navigation:true,research:false,followup:false};
  const cs=document.getElementById('cloudStatus');
  cs.textContent = Cloud.enabled ? L('Cloud sync ON (Supabase) — writes mirrored to your project.','Usawazishaji wa cloud WASHI (Supabase) — maandiko yanaakisiwa kwenye mradi wako.')
                                 : L('DEMO — on-device storage only (no cloud connected).','DEMO — hifadhi ya kifaa hiki pekee (hakuna cloud iliyounganishwa).');
  cs.className = Cloud.enabled ? 'badge b-live' : 'badge b-demo';
  document.getElementById('cNav').checked=c.navigation;
  document.getElementById('cRes').checked=c.research;
  document.getElementById('cFu').checked=c.followup;
  document.getElementById('privChips').innerHTML=DemoData.privCards.map(p=>
    `<span class="tag t3" style="font-size:.75rem;padding:9px 13px">${p[0]} ${L(p[1], p[1]==='Data minimization'?'Kupunguza data':p[1]==='Encryption'?'Usimbaji':p[1]==='Access control'?'Udhibiti wa ufikiaji':p[1]==='Audit trails'?'Rekodi za ukaguzi':p[1]==='De-identification'?'Kuondoa majina':p[1]==='Consent'?'Ridhaa':'Kujitoa')} — ${L(p[2], { 'Collect only what is needed':'Kusanya kinachohitajika tu','Protect data in transit & at rest':'Linda data','Only authorised people see personal data':'Watu walioidhinishwa pekee','Record who accessed what, when':'Rekodi nani alifikia nini, lini','Separate identity from health data':'Tenga utambulisho na data ya afya','Clear, informed, revocable choices':'Chaguo wazi na rahisi kujitoa','Leave the programme at any time':'Ondoka wakati wowote'}[p[2]]||p[2])}</span>`).join('');
}
function setResearch(v){
  API.research.save(v);
  toast(v ? L('Noted: you would contribute (concept — nothing collected yet).','Imerekodiwa: ungechangia (dhana — hakuna kilichokusanywa bado).')
          : L('Noted: you would not contribute. This never affects your care.','Imerekodiwa: hukuchangia. Hii haiathiri huduma yako hata kidogo.'));
  renderMore();
}
function saveConsent(){
  API.consent.save({ navigation:document.getElementById('cNav').checked, research:document.getElementById('cRes').checked, followup:document.getElementById('cFu').checked });
  toast(L('Consent choices saved (this device only).','Chaguo za ridhaa zimehifadhiwa (kifaa hiki tu).'));
}

/* =====================================================================
   UI — renderer registry + init
===================================================================== */
RENDER.pima = () => { const scr=document.getElementById('screener'), res=document.getElementById('result'), br=document.getElementById('breathCard');
  if(scr.style.display!=='none' && !scr.style.display.match(/none/)){ (pPhase==='s') ? renderSafety(Math.min(safeI, SAFETY.length-1)) : renderQ(); }
  else if(res.style.display!=='none'){ showResult(true); }
  else if(br.style.display==='block'){ /* calm pause shown */ }
  else updateResumeBox();
};
let safeI=0;
RENDER.passport = renderPass;
RENDER.thibiti = renderClinics;
RENDER.fanya = renderFanya;
RENDER.obs = renderObs;
RENDER.shule = () => { renderQuiz(); renderScen(); renderAtt(); };
RENDER.journey = renderJourney;
RENDER.more = renderMore;

document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeDocModal(); });
function toggleMoreNav(){
  const m=document.getElementById('navMore'), b=document.getElementById('navMoreBtn');
  const open=!m.hidden; m.hidden=open; b.setAttribute('aria-expanded', String(!open));
}
function wipeDevice(btn){
  if(btn && !btn.dataset.arm){
    btn.dataset.arm='1';
    const t0=btn.textContent;
    btn.textContent=L('Tap again to confirm','Gusa tena kuthibitisha');
    setTimeout(()=>{ delete btn.dataset.arm; btn.textContent=t0; }, 3500);
    return;
  }
  Store.wipe();
  Object.keys(answers).forEach(k=>delete answers[k]);
  qIdx=0; pPhase='q'; pStep=0;
  refreshActive();
  toast(L('Done — this device is clean.','Imekamilika — kifaa hiki ni safi.'));
}

/* ---------- living interface: gentle motion (reduced-motion aware) ---------- */
const REDUCED = (typeof window!=='undefined' && window.matchMedia) ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : true;
const WORDS = [
  ['You are not alone — millions feel this too.','Wewe si peke yako — mamilioni wanahisi hivi pia.'],
  ['Your pain is real, and it deserves to be taken seriously.','Maumivu yako ni halisi, na yanastahili kuzingatiwa.'],
  ['The first step is only a conversation.','Hatua ya kwanza ni mazungumzo tu.'],
  ['Help exists — knowing your next step starts here.','Msaada upo — kujua hatua yako inayofuata huanza hapa.'],
  ['You can pause, skip, or share nothing at all.','Unaweza kusimama, kuruka, au kutoshiriki chochote.'],
  ['This space belongs to you.','Nafasi hii ni yako.']
];
let twTimer=null, twWord=0, twPos=0, twDeleting=false;
function twSet(t){ const el=document.getElementById('typedText'); if(el) el.textContent=t; }
function twTick(){
  const pair=WORDS[twWord]; const full=L(pair[0],pair[1]);
  twPos += twDeleting ? -1 : 1;
  if(!twDeleting && twPos>=full.length){ twSet(full); twDeleting=true; twTimer=setTimeout(twTick,2100); return; }
  if(twDeleting && twPos<=0){ twDeleting=false; twWord=(twWord+1)%WORDS.length; twSet(''); twTimer=setTimeout(twTick,430); return; }
  twSet(full.slice(0,twPos));
  twTimer=setTimeout(twTick, twDeleting?13:34);
}
function refreshTyped(full){
  if(twTimer){ clearTimeout(twTimer); twTimer=null; }
  const el=document.getElementById('typedText');
  if(!el) return;
  if(REDUCED){ twSet(L(WORDS[0][0],WORDS[0][1])); return; }
  twPos=0; twDeleting=false; twSet('');
  if(full===false) twWord=(twWord+1)%WORDS.length;
  twTick();
}
function countUp(el){
  const target=parseFloat(el.dataset.count)||0, suffix=el.dataset.suffix||'', dur=1400, t0=Date.now();
  const raf=window.requestAnimationFrame||(f=>setTimeout(f,16));
  const step=()=>{ const p=Math.min(1,(Date.now()-t0)/dur), eased=1-Math.pow(1-p,3);
    el.textContent=Math.round(target*eased).toLocaleString('en-KE')+suffix;
    if(p<1) raf(step); };
  raf(step);
}
function setStatFinal(stats){ stats.forEach(b=>{ b.textContent=Number(b.dataset.count).toLocaleString('en-KE')+(b.dataset.suffix||''); }); }
function initLively(){
  const stats=document.querySelectorAll('.stat b[data-count]');
  if(REDUCED){ setStatFinal(stats); return; }
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver(entries=>{
    let statsFired=false;
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        if(!statsFired && e.target.matches && e.target.matches('.stats')){ statsFired=true; stats.forEach(countUp); }
        io.unobserve(e.target);
      }
    });
  },{threshold:.15, rootMargin:'0px 0px -30px 0px'}) : null;
  if(io){
    const targets=document.querySelectorAll('.card,.sec,.step,.frow');
    targets.forEach((t,i)=>{ t.classList.add('reveal'); t.style.setProperty('--d', (i%4)*0.06+'s'); io.observe(t); });
    const stBox=document.querySelector('.stats');
    if(stBox) io.observe(stBox);
  } else setStatFinal(stats);
}
document.addEventListener('DOMContentLoaded', initLively);
document.addEventListener('DOMContentLoaded', () => {
  vPad();
  renderPartners();
  renderClinics();
  renderObs();
  renderAtt();
  renderJourney();
  renderMore();
  applyI18n();
  go('home');
  // Register the offline application shell.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function(reg){
      console.log('[EndoPima] SW registered', reg.scope);
    }).catch(function(e){
      console.warn('[EndoPima] SW registration failed', e);
    });
  }
});
