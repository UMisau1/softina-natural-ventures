"use strict";

/* ==========================================
   SOFTINA NATURAL VENTURES
   PRODUCT CATALOGUE V2.0
   Bayanin Kayayyaki da Ayyuka da Hausa
   ========================================== */

const SOFTINA_PRODUCTS = [
    {
        id: 1,
        name: "Kari na Gina Jiki na Halitta",
        type: "product",
        category: "supplements",
        categoryName: "Kari na Gina Jiki",
        shortDescription: "Kari na gina jiki na halitta daga Softina Natural Ventures.",
        description: "Wannan kari ne na gina jiki na halitta da Softina Natural Ventures ke samarwa. Tuntuɓi ƙungiyarmu domin samun cikakken bayani kan samfurin, samuwarsa, farashinsa da shawarwarin amfani da shi yadda ya dace.",
        price: null,
        oldPrice: null,
        discount: null,
        size: "",
        stockStatus: "Akwai",
        image: "images/products/product-1.jpg",
        featured: true,
        isNew: true,
        available: true
    },
    {
        id: 2,
        name: "Shayin Ganyayyakin Magani",
        type: "product",
        category: "herbal-tea",
        categoryName: "Shayin Ganyayyaki",
        shortDescription: "Shayin ganyayyaki da aka shirya cikin buhunan shayi masu sauƙin amfani.",
        description: "Shayin ganyayyaki daga Softina Natural Ventures, wanda aka shirya domin sauƙin sarrafawa da sha. Tuntuɓe mu domin samun bayanin samfurin, tabbatar da samuwarsa da sanin farashinsa na yanzu.",
        price: null,
        oldPrice: null,
        discount: null,
        size: "",
        stockStatus: "Akwai",
        image: "images/products/product-2.jpg",
        featured: true,
        isNew: true,
        available: true
    },
    {
        id: 3,
        name: "Kayan Gyaran Jiki na Halitta",
        type: "product",
        category: "cosmetics",
        categoryName: "Kayan Gyaran Jiki",
        shortDescription: "Kayayyakin gyaran jiki na halitta domin kula da tsaftar jiki da kyau.",
        description: "Softina Natural Ventures na samar da kayayyakin gyaran jiki na halitta domin kula da jiki da kyawunsa. Tuntuɓe mu domin sanin irin kayayyakin da ake da su, farashinsu da ƙarin bayanai game da kowanne samfur.",
        price: null,
        oldPrice: null,
        discount: null,
        size: "",
        stockStatus: "Akwai",
        image: "images/products/product-3.jpg",
        featured: true,
        isNew: false,
        available: true
    },
    {
        id: 4,
        name: "Man Halitta",
        type: "product",
        category: "oils",
        categoryName: "Man Fetur na Halitta",
        shortDescription: "Man da aka samo daga sinadaran halitta daga Softina Natural Ventures.",
        description: "Man halitta da Softina Natural Ventures ke samarwa. Tuntuɓe mu domin samun bayanai kan samfurin, yadda ake samunsa da farashinsa na yanzu.",
        price: null,
        oldPrice: null,
        discount: null,
        size: "",
        stockStatus: "Akwai",
        image: "images/products/product-4.jpg",
        featured: true,
        isNew: false,
        available: true
    },
    {
        id: 5,
        name: "Kayan Yaji da Ƙamshin Abinci na Halitta",
        type: "product",
        category: "spices",
        categoryName: "Kayan Yaji da Ƙamshin Abinci",
        shortDescription: "Kayan yaji da kayan ƙara ɗanɗano na halitta daga Softina Natural Ventures.",
        description: "Zaɓaɓɓun kayan yaji da kayan ƙara ɗanɗano na halitta daga Softina Natural Ventures. Tuntuɓe mu domin sanin nau'ikan da ake da su, girman marufi, farashinsu da ƙarin bayanai kan kayayyakin.",
        price: null,
        oldPrice: null,
        discount: null,
        size: "",
        stockStatus: "Akwai",
        image: "images/products/product-5.jpg",
        featured: true,
        isNew: true,
        available: true
    },
    {
        id: 6,
        name: "Tsarin Abinci da Rayuwa Mai Kyau",
        type: "service",
        category: "diet-lifestyle",
        categoryName: "Tsarin Abinci da Rayuwa",
        shortDescription: "Shawarwari kan tsarin abinci da rayuwa bisa buƙatu da manufofin mutum.",
        description: "Wannan sabis yana ba da jagoranci kan tsarin abinci da rayuwa mai kyau bisa buƙatu da manufofin kowane mutum. Tuntuɓi Softina Natural Ventures domin ƙarin bayani kan shawarwari da tsarin da ake bayarwa.",
        price: null,
        oldPrice: null,
        discount: null,
        size: "",
        stockStatus: "Akwai",
        image: "images/products/product-6.jpg",
        featured: true,
        isNew: true,
        available: true
    },
    {
        id: 7,
        name: "Homeopathy (Magungunan Gida)",
        type: "service",
        category: "homeopathy",
        categoryName: "Homeopathy",
        shortDescription: "Shawarwari da ayyukan da suka shafi Homeopathy daga Softina Natural Ventures.",
        description: "Softina Natural Ventures na bayar da shawarwari da wasu ayyuka masu alaƙa da Homeopathy. Tuntuɓe mu domin tattauna ayyukan da ake da su, yadda ake samun shawarwari da kuɗin sabis. Lura: kada a ɗauki wannan bayanin a matsayin tabbacin cewa waɗannan hanyoyin suna da ingancin magani da aka tabbatar a kimiyance.",
        price: null,
        oldPrice: null,
        discount: null,
        size: "",
        stockStatus: "Akwai",
        image: "images/products/product-7.jpg",
        featured: true,
        isNew: false,
        available: true
    },
    {
        id: 8,
        name: "Cibiyar Koyar da Magungunan Ganyayyaki ta Softina",
        type: "service",
        category: "academy",
        categoryName: "Cibiyar Koyon Softina",
        shortDescription: "Damar koyo da samun horo a Cibiyar Koyar da Magungunan Ganyayyaki ta Softina.",
        description: "Cibiyar Koyar da Magungunan Ganyayyaki ta Softina tana bayar da shirye-shiryen ilimi da horo. Tuntuɓi cibiyar domin samun bayanai kan kwasa-kwasai, sharuɗɗan shiga da cikakken bayani game da horon da ake bayarwa.",
        price: null,
        oldPrice: null,
        discount: null,
        size: "",
        stockStatus: "Akwai",
        image: "images/products/product-8.jpg",
        featured: true,
        isNew: true,
        available: true
    },
    {
        id: 9,
        name: "Bincike da Ba da Shawarwari",
        type: "service",
        category: "research-consultation",
        categoryName: "Bincike da Shawarwari",
        shortDescription: "Ayyukan bincike da shawarwari kan lafiyar halitta daga Softina Natural Ventures.",
        description: "Softina Natural Ventures na bayar da ayyukan bincike da shawarwari masu alaƙa da lafiyar halitta. Tuntuɓe mu domin tattauna buƙatunku, nau'ikan shawarwarin da ake da su da cikakken bayani kan sabis ɗin.",
        price: null,
        oldPrice: null,
        discount: null,
        size: "",
        stockStatus: "Akwai",
        image: "images/products/product-9.jpg",
        featured: true,
        isNew: false,
        available: true
    },
    {
        id: 10,
        name: "Shawarwarin Lafiya Ta Intanet da Kai-tsaye",
        type: "service",
        category: "consultation",
        categoryName: "Shawarwari Ta Intanet da Kai-tsaye",
        shortDescription: "Sabis na shawarwari ta intanet ko ganawa kai-tsaye daga Softina Natural Ventures.",
        description: "Ana iya samun shawarwari ta intanet ko ta hanyar ganawa kai-tsaye. Tuntuɓi Softina Natural Ventures domin sanin yadda ake yin alƙawari, lokutan da ake da su da sauran bayanai game da shawarwarin.",
        price: null,
        oldPrice: null,
        discount: null,
        size: "",
        stockStatus: "Akwai",
        image: "images/products/product-10.jpg",
        featured: true,
        isNew: true,
        available: true
    },

    /* ==========================================
       KAYAYYAKI NA 11
       ========================================== */
    {
        id: 11,
        name: "Gishirin Teku na SOFTINA",
        type: "product",
        category: "spices",
        categoryName: "Kayan Yaji da Ƙamshin Abinci",
        shortDescription: "Gishirin teku na Softina, gram 120.",
        description: "Gishirin teku na Softina, wanda aka shirya domin amfani da shi a gida. Ana iya amfani da shi wajen girki. Haka kuma, ana iya amfani da shi wajen kula da fata ko saka shi cikin ruwan wanka idan ya dace da manufar amfani. Sinadaran da mai samarwa ya bayyana: gishirin teku kawai, ba tare da ƙarin wasu sinadarai ko abubuwan adanawa ba. Ajiye shi a wuri busasshe, kuma a rufe marufinsa sosai bayan amfani. GARGAƊI: Gishirin teku yana ɗauke da sinadarin sodium. Yawan cin sodium na iya ƙara haɗarin hawan jini. Ba a tabbatar da cewa gishirin teku ya fi sauran nau'ikan gishiri aminci ga masu hawan jini ba.",
        price: 1500,
        oldPrice: null,
        discount: null,
        size: "120g",
        stockStatus: "Akwai",
        image: "images/products/product-11.jpg",
        featured: true,
        isNew: true,
        available: true
    },

    /* ==========================================
       KAYAYYAKI NA 12
       ========================================== */
    {
        id: 12,
        name: "Gishirin Himalayan Mai Ruwan Hoda na SOFTINA",
        type: "product",
        category: "spices",
        categoryName: "Kayan Yaji da Ƙamshin Abinci",
        shortDescription: "Gishirin Himalayan mai ruwan hoda na Softina, gram 100.",
        description: "Gishirin Himalayan mai ruwan hoda wanda ake amfani da shi wajen girki da ƙara ɗanɗano ga abinci. Haka kuma, ana iya amfani da shi wajen kula da fata ko saka shi cikin ruwan wanka idan ya dace. Ajiye shi a wuri busasshe, kuma a rufe marufinsa sosai bayan amfani. GARGAƊI: Yana ɗauke da sodium, kuma yawan amfani da shi na iya ƙara haɗarin hawan jini. Ba a tabbatar da cewa ya fi sauran nau'ikan gishiri aminci ga masu hawan jini ba.",
        price: 2500,
        oldPrice: null,
        discount: null,
        size: "100g",
        stockStatus: "Akwai",
        image: "images/products/product-12.jpg",
        featured: true,
        isNew: true,
        available: true
    },

    /* ==========================================
       KAYAYYAKI NA 13
       ========================================== */
    {
        id: 13,
        name: "Haɗaɗɗun Kayan Yaji na SOFTINA",
        type: "product",
        category: "spices",
        categoryName: "Kayan Yaji da Ƙamshin Abinci",
        shortDescription: "Haɗaɗɗun kayan yaji na musamman domin ƙara ɗanɗano da ƙamshi ga nau'ikan abinci daban-daban.",
        description: "Haɗaɗɗun kayan yaji na Softina an tsara su ne domin ƙara ɗanɗano da ƙamshi ga abinci iri-iri. Sinadaran da aka bayar sun haɗa da: busasshen citta, busasshen tafarnuwa, busasshen albasa, coriander, cumin, barkono fari, barkono baƙi, kanumfari, kirfa, kurkum, paprika, goro mai ƙamshi (nutmeg), thyme, busasshen ganyen bay da 'ya'yan fennel. Yi amfani da adadin da ya dace yayin girki. Ajiye shi a wuri busasshe, kuma a rufe marufinsa sosai bayan amfani.",
        price: 2500,
        oldPrice: null,
        discount: null,
        size: "",
        stockStatus: "Akwai",
        image: "images/products/product-13.jpg",
        featured: true,
        isNew: true,
        available: true
    },

    /* ==========================================
       KAYAYYAKI NA 14
       ========================================== */
    {
        id: 14,
        name: "Herbal Blend",
        type: "product",
        category: "Natural Support for Kidney Infection",
        categoryName: "Maganin Kidney Infection",
        shortDescription: " Maganin kidney infection, sannan zaku iya hada shi da na capsule dukka amma ga wanda basu da karfi sosai zasu iya sayen na powder din kawai su bar na capsule, amma idan kana da hali ka sayi dukka biyun zaifi insha Allah. Sannan Abu Mai muhimmanci akan kidney infection shine dole sai kun Kiyaye dokokin da zamu baku a rubuce ku masu wannan cutar idan har ba zaku iya kiyaye wa ba dan Allah karma ka wahalar da kanka ka saya, bin doka shine ainihin mafita ga wannan cutar da kuma hadawa da maganin daya dace. Dukka dana powder din dana Capsule gaba daya 10k ne, Wanda bashida karfi ya sayi na powder kadai kawai.",
        price: 10000,
        oldPrice: null,
        discount: null,
        size: "",
        stockStatus: "Akwai",
        image: "images/products/product-14.jpg",
        featured: true,
        isNew: true,
        available: true
    }
];

/* ==========================================
   FITAR DA JERIN KAYAYYAKI
   ========================================== */

if (typeof window !== "undefined") {
    window.SOFTINA_PRODUCTS = SOFTINA_PRODUCTS;
}