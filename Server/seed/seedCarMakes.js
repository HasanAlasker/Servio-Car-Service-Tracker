import mongoose from "mongoose";
import CarMakeModel from "../models/carMake.js";

const carMakesData = [
  // ===== Japanese =====
  {
    make: "toyota",
    name: [
      "corolla", "camry", "avanza", "yaris", "prado", "land cruiser",
      "fortuner", "hilux", "rav4", "highlander", "4runner",
      "prius", "avalon", "c-hr", "urban cruiser", "coaster",
      "crown", "gr86", "supra", "bz4x", "sequoia", "tundra", "venza", "corolla cross"
    ],
  },
  {
    make: "lexus",
    name: [
      "es", "is", "ls", "rx", "nx", "ux", "gx", "lx", "rc", "lc",
      "rz", "lm", "tx", "lbx", "is 500", "rc f"
    ],
  },
  {
    make: "nissan",
    name: [
      "sunny", "sentra", "altima", "maxima", "patrol", "x-trail",
      "rogue", "pathfinder", "armada", "navara", "leaf",
      "ariya", "z", "gt-r", "kicks", "frontier", "juke", "magnite"
    ],
  },
  {
    make: "infiniti",
    name: ["q50", "q60", "qx50", "qx55", "qx60", "qx80", "qxmonograph"],
  },
  {
    make: "honda",
    name: [
      "accord", "civic", "cr-v", "hr-v", "pilot", "odyssey", "city", "fit",
      "prologue", "passport", "ridgeline", "jazz", "nsx", "civic type r"
    ],
  },
  {
    make: "acura",
    name: ["integra", "tlx", "rdx", "mdx", "zdx", "nsx type s"],
  },
  {
    make: "mazda",
    name: [
      "mazda2", "mazda3", "mazda6", "cx-3", "cx-5", "cx-9", "bt-50", "mx-5",
      "cx-30", "cx-50", "cx-60", "cx-70", "cx-80", "cx-90", "mx-30"
    ],
  },
  {
    make: "mitsubishi",
    name: [
      "lancer", "lancer ex", "pajero", "pajero sport",
      "outlander", "outlander sport", "asx", "mirage", "eclipse cross",
      "attrage", "xpander", "triton", "montero sport"
    ],
  },
  {
    make: "subaru",
    name: [
      "impreza", "legacy", "outback", "forester", "crosstrek", "wrx", "brz",
      "solterra", "ascent"
    ],
  },
  {
    make: "suzuki",
    name: [
      "alto", "swift", "ciaz", "vitara", "jimny", "ertiga",
      "baleno", "ignis", "s-cross", "grand vitara", "dzire", "fronx"
    ],
  },
  {
    make: "isuzu",
    name: ["d-max", "mu-x"],
  },

  // ===== Korean =====
  {
    make: "hyundai",
    name: [
      "avante", "elantra", "accent", "sonata", "tucson", "santa fe",
      "palisade", "kona", "creta", "venue", "ioniq", "ioniq 5", "ioniq 6",
      "ioniq 7", "staria", "veloster n", "bayon", "casper", "santa cruz"
    ],
  },
  {
    make: "kia",
    name: [
      "sephia", "cerato", "forte", "rio", "picanto",
      "optima", "k5", "sportage", "sorento", "telluride",
      "seltos", "carnival", "stinger", "ev6", "ev9", "ev3", "ev4", "niro", "soul"
    ],
  },
  {
    make: "genesis",
    name: [
      "g70", "g80", "g90", "gv60", "gv70", "gv80", "gv90",
      "electrified g80", "electrified gv70", "gv80 coupe"
    ],
  },

  // ===== German =====
  {
    make: "bmw",
    name: [
      "1 series", "2 series", "3 series", "4 series", "5 series", "7 series", "8 series",
      "x1", "x2", "x3", "x4", "x5", "x6", "x7", "xm",
      "i4", "i5", "i7", "ix1", "ix3", "ix"
    ],
  },
  {
    make: "mercedes",
    name: [
      "a-class", "c-class", "e-class", "s-class",
      "g-class", "gla", "glb", "glc", "gle", "gls", "cla", "cls",
      "eqs", "eqe", "eqa", "eqb", "amg gt", "sl-class"
    ],
  },
  {
    make: "audi",
    name: [
      "a1", "a3", "a4", "a5", "a6", "a7", "a8",
      "q2", "q3", "q4 e-tron", "q5", "q6 e-tron", "q7", "q8", "e-tron gt", "r8"
    ],
  },
  {
    make: "volkswagen",
    name: [
      "jetta", "passat", "golf", "golf gti", "golf r", "tiguan",
      "touareg", "atlas", "id.3", "id.4", "id.5", "id.6", "id.7", "id. buzz",
      "t-roc", "t-cross", "taos", "arteon"
    ],
  },
  {
    make: "porsche",
    name: [
      "911", "cayenne", "macan", "panamera", "taycan", "718 boxster", "718 cayman",
      "macan electric"
    ],
  },
  {
    make: "skoda",
    name: ["octavia", "superb", "rapid", "karoq", "kodiaq", "kamiq", "enyaq", "fabia"],
  },
  {
    make: "opel",
    name: [
      "corsa", "astra", "mokka", "grandland", "frontera", "crossland", 
      "insignia", "combo life", "zafira life", "rocks-e", "astra gse", "mokka gse"
    ],
  },

  // ===== American =====
  {
    make: "ford",
    name: [
      "focus", "fusion", "escape", "edge",
      "explorer", "expedition", "ranger", "f-150", "mustang",
      "bronco", "bronco sport", "maverick", "mustang mach-e", "f-150 lightning", "territory"
    ],
  },
  {
    make: "chevrolet",
    name: [
      "aveo", "cruze", "malibu", "impala",
      "captiva", "equinox", "tahoe", "silverado",
      "suburban", "colorado", "corvette", "camaro", "blazer", "trax", "bolt ev"
    ],
  },
  {
    make: "gmc",
    name: ["sierra", "terrain", "acadia", "yukon", "canyon", "hummer ev"],
  },
  {
    make: "cadillac",
    name: ["ct4", "ct5", "xt4", "xt5", "xt6", "escalade", "lyriq", "celestiq", "optiq", "vistiq"],
  },
  {
    make: "lincoln",
    name: [
      "corsair", "nautilus", "aviator", "navigator", "zephyr", 
      "mkz", "mkt", "continental"
    ],
  },
  {
    make: "jeep",
    name: [
      "wrangler", "cherokee", "grand cherokee", "compass", "renegade", "gladiator",
      "grand wagoneer", "avenger", "recon"
    ],
  },
  {
    make: "dodge",
    name: ["charger", "challenger", "durango", "hornet"],
  },
  {
    make: "ram",
    name: ["1500", "2500", "3500", "promaster", "ram ev"],
  },
  {
    make: "tesla",
    name: ["model s", "model 3", "model x", "model y", "cybertruck", "roadster"],
  },
  {
    make: "lucid",
    name: ["air pure", "air touring", "air grand touring", "air sapphire", "gravity"],
  },
  {
    make: "rivian",
    name: ["r1t", "r1s", "r2", "r3", "r3x"],
  },
  // ===== European (Other) =====
  {
    make: "peugeot",
    name: ["206", "207", "208", "301", "308", "408", "508", "2008", "3008", "5008", "e-208"],
  },
  {
    make: "renault",
    name: ["logan", "symbol", "megane", "duster", "koleos", "austral", "arkana", "zoe", "clio", "captur"],
  },
  {
    make: "fiat",
    name: ["500", "500e", "tipo", "panda", "doblo", "600", "fastback", "pulse"],
  },
  {
    make: "volvo",
    name: ["s60", "s90", "xc40", "xc60", "xc90", "v60", "v90", "ex30", "ex90", "c40"],
  },
  {
    make: "mini",
    name: ["cooper", "countryman", "clubman", "electric", "aceman"],
  },
  {
    make: "land rover",
    name: [
      "range rover", "range rover sport", "range rover evoque",
      "range rover velar", "discovery", "discovery sport", "defender 90", "defender 110", "defender 130"
    ],
  },
  {
    make: "jaguar",
    name: ["xe", "xf", "xj", "f-pace", "e-pace", "i-pace", "f-type"],
  },

  // ===== Chinese (Expanding Markets) =====
  {
    make: "changan",
    name: [
      "alsvin", "eado plus", "raeton plus", "cs35 plus", "cs55 plus", 
      "cs75 plus", "cs85", "cs95", "hunter", "uni-t", "uni-k", 
      "uni-v", "uni-s", "uni-z", "lumin", "qiyuan a07", "deepal sl03", "deepal s7"
    ],
  },

  {
    make: "chery",
    name: [
      "tiggo 2", "tiggo 4", "tiggo 7", "tiggo 8", "tiggo 9",
      "arrizo 5", "arrizo 8", "omoda 5", "jaecoo 7"
    ],
  },
  {
    make: "geely",
    name: [
      "emgrand", "coolray", "azkarra", "geometry c", "tugella",
      "monjaro", "okavango", "starray", "zeekr 001"
    ],
  },
  {
    make: "byd",
    name: [
      "f3", "han", "tang", "atto 3", "seal", "dolphin",
      "seagull", "song", "qin", "shark", "sealion 6", "sealion 7"
    ],
  },
  {
    make: "mg",
    name: ["mg3", "mg5", "mg6", "zs", "hs", "rx5", "rx8", "mg4 ev", "cyberster", "marvel r"],
  },
  {
    make: "haval",
    name: ["jolion", "h6", "h9", "dargo", "tank 300", "tank 500"],
  },
  {
    make: "jetour",
    name: ["x70", "x70 plus", "x90 plus", "dashing", "t2", "traveller"],
  },
  // ===== (Exotic) =====
  {
    make: "ferrari",
    name: [
      "296 gtb", "sf90 stradale", "roma", "portofino m", 
      "812 superfast", "purosangue", "f8 tributo", "12cilindri"
    ],
  },
  {
    make: "lamborghini",
    name: ["revuelto", "huracan tecnica", "urus s", "urus performante", "temerario"],
  },
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await CarMakeModel.deleteMany({});
    console.log("Cleared existing car makes");

    // Insert new data
    const result = await CarMakeModel.insertMany(carMakesData);
    console.log(`Successfully seeded ${result.length} car makes`);

    // Display summary
    console.log("\nSeeded car makes:");
    result.forEach((make) => {
      console.log(`- ${make.make}: ${make.name.length} name`);
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

export default seedDatabase;
