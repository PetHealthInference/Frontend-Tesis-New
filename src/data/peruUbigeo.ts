export type UbigeoDistrict = {
  name: string;
  code: string;
};

export type UbigeoProvince = {
  name: string;
  districts: UbigeoDistrict[];
};

export type UbigeoDepartment = {
  name: string;
  provinces: UbigeoProvince[];
};

const BASE_PERU_UBIGEO: UbigeoDepartment[] = [
  { name: "Amazonas", provinces: [{ name: "Chachapoyas", districts: [{ name: "Chachapoyas", code: "010101" }] }] },
  { name: "Ancash", provinces: [{ name: "Huaraz", districts: [{ name: "Huaraz", code: "020101" }] }] },
  { name: "Apurimac", provinces: [{ name: "Abancay", districts: [{ name: "Abancay", code: "030101" }] }] },
  {
    name: "Arequipa",
    provinces: [
      {
        name: "Arequipa",
        districts: [
          { name: "Arequipa", code: "040101" },
          { name: "Alto Selva Alegre", code: "040102" },
          { name: "Cayma", code: "040103" },
          { name: "Cerro Colorado", code: "040104" },
          { name: "Jose Luis Bustamante y Rivero", code: "040129" },
          { name: "Miraflores", code: "040110" },
          { name: "Paucarpata", code: "040112" },
          { name: "Yanahuara", code: "040126" },
        ],
      },
    ],
  },
  { name: "Ayacucho", provinces: [{ name: "Huamanga", districts: [{ name: "Ayacucho", code: "050101" }] }] },
  { name: "Cajamarca", provinces: [{ name: "Cajamarca", districts: [{ name: "Cajamarca", code: "060101" }] }] },
  {
    name: "Callao",
    provinces: [
      {
        name: "Callao",
        districts: [
          { name: "Callao", code: "070101" },
          { name: "Bellavista", code: "070102" },
          { name: "Carmen de la Legua Reynoso", code: "070103" },
          { name: "La Perla", code: "070104" },
          { name: "La Punta", code: "070105" },
          { name: "Ventanilla", code: "070106" },
          { name: "Mi Peru", code: "070107" },
        ],
      },
    ],
  },
  { name: "Cusco", provinces: [{ name: "Cusco", districts: [{ name: "Cusco", code: "080101" }, { name: "San Sebastian", code: "080105" }, { name: "Wanchaq", code: "080108" }] }] },
  { name: "Huancavelica", provinces: [{ name: "Huancavelica", districts: [{ name: "Huancavelica", code: "090101" }] }] },
  { name: "Huanuco", provinces: [{ name: "Huanuco", districts: [{ name: "Huanuco", code: "100101" }] }] },
  { name: "Ica", provinces: [{ name: "Ica", districts: [{ name: "Ica", code: "110101" }, { name: "La Tinguina", code: "110105" }, { name: "Parcona", code: "110107" }] }] },
  { name: "Junin", provinces: [{ name: "Huancayo", districts: [{ name: "Huancayo", code: "120101" }, { name: "El Tambo", code: "120114" }, { name: "Chilca", code: "120107" }] }] },
  { name: "La Libertad", provinces: [{ name: "Trujillo", districts: [{ name: "Trujillo", code: "130101" }, { name: "El Porvenir", code: "130102" }, { name: "La Esperanza", code: "130105" }, { name: "Victor Larco Herrera", code: "130111" }] }] },
  { name: "Lambayeque", provinces: [{ name: "Chiclayo", districts: [{ name: "Chiclayo", code: "140101" }, { name: "Jose Leonardo Ortiz", code: "140105" }, { name: "La Victoria", code: "140106" }] }] },
  {
    name: "Lima",
    provinces: [
      {
        name: "Lima",
        districts: [
          { name: "Lima", code: "150101" },
          { name: "Ancon", code: "150102" },
          { name: "Ate", code: "150103" },
          { name: "Barranco", code: "150104" },
          { name: "Brena", code: "150105" },
          { name: "Carabayllo", code: "150106" },
          { name: "Chaclacayo", code: "150107" },
          { name: "Chorrillos", code: "150108" },
          { name: "Cieneguilla", code: "150109" },
          { name: "Comas", code: "150110" },
          { name: "El Agustino", code: "150111" },
          { name: "Independencia", code: "150112" },
          { name: "Jesus Maria", code: "150113" },
          { name: "La Molina", code: "150114" },
          { name: "La Victoria", code: "150115" },
          { name: "Lince", code: "150116" },
          { name: "Los Olivos", code: "150117" },
          { name: "Lurigancho", code: "150118" },
          { name: "Lurin", code: "150119" },
          { name: "Magdalena del Mar", code: "150120" },
          { name: "Pueblo Libre", code: "150121" },
          { name: "Miraflores", code: "150122" },
          { name: "Pachacamac", code: "150123" },
          { name: "Pucusana", code: "150124" },
          { name: "Puente Piedra", code: "150125" },
          { name: "Punta Hermosa", code: "150126" },
          { name: "Punta Negra", code: "150127" },
          { name: "Rimac", code: "150128" },
          { name: "San Bartolo", code: "150129" },
          { name: "San Borja", code: "150130" },
          { name: "San Isidro", code: "150131" },
          { name: "San Juan de Lurigancho", code: "150132" },
          { name: "San Juan de Miraflores", code: "150133" },
          { name: "San Luis", code: "150134" },
          { name: "San Martin de Porres", code: "150135" },
          { name: "San Miguel", code: "150136" },
          { name: "Santa Anita", code: "150137" },
          { name: "Santa Maria del Mar", code: "150138" },
          { name: "Santa Rosa", code: "150139" },
          { name: "Santiago de Surco", code: "150140" },
          { name: "Surquillo", code: "150141" },
          { name: "Villa El Salvador", code: "150142" },
          { name: "Villa Maria del Triunfo", code: "150143" },
        ],
      },
      { name: "Huaral", districts: [{ name: "Huaral", code: "150601" }] },
      { name: "Huaura", districts: [{ name: "Huacho", code: "150801" }] },
      { name: "Canete", districts: [{ name: "San Vicente de Canete", code: "150501" }] },
    ],
  },
  { name: "Loreto", provinces: [{ name: "Maynas", districts: [{ name: "Iquitos", code: "160101" }, { name: "Punchana", code: "160108" }, { name: "San Juan Bautista", code: "160113" }] }] },
  { name: "Madre de Dios", provinces: [{ name: "Tambopata", districts: [{ name: "Tambopata", code: "170101" }] }] },
  { name: "Moquegua", provinces: [{ name: "Mariscal Nieto", districts: [{ name: "Moquegua", code: "180101" }] }] },
  { name: "Pasco", provinces: [{ name: "Pasco", districts: [{ name: "Chaupimarca", code: "190101" }] }] },
  { name: "Piura", provinces: [{ name: "Piura", districts: [{ name: "Piura", code: "200101" }, { name: "Castilla", code: "200104" }, { name: "Veintiseis de Octubre", code: "200115" }] }, { name: "Sullana", districts: [{ name: "Sullana", code: "200601" }] }] },
  { name: "Puno", provinces: [{ name: "Puno", districts: [{ name: "Puno", code: "210101" }] }] },
  { name: "San Martin", provinces: [{ name: "Moyobamba", districts: [{ name: "Moyobamba", code: "220101" }] }, { name: "San Martin", districts: [{ name: "Tarapoto", code: "220901" }] }] },
  { name: "Tacna", provinces: [{ name: "Tacna", districts: [{ name: "Tacna", code: "230101" }, { name: "Alto de la Alianza", code: "230102" }, { name: "Ciudad Nueva", code: "230104" }] }] },
  { name: "Tumbes", provinces: [{ name: "Tumbes", districts: [{ name: "Tumbes", code: "240101" }] }] },
  { name: "Ucayali", provinces: [{ name: "Coronel Portillo", districts: [{ name: "Calleria", code: "250101" }, { name: "Yarinacocha", code: "250105" }] }] },
];
type ProvinceCapital = {
  name: string;
  capital: string;
  code: string;
};

const PROVINCE_CAPITALS_BY_DEPARTMENT: Record<string, ProvinceCapital[]> = {
  Amazonas: [
    { name: "Chachapoyas", capital: "Chachapoyas", code: "0101" },
    { name: "Bagua", capital: "Bagua", code: "0102" },
    { name: "Bongara", capital: "Jumbilla", code: "0103" },
    { name: "Condorcanqui", capital: "Santa Maria de Nieva", code: "0104" },
    { name: "Luya", capital: "Lamud", code: "0105" },
    { name: "Rodriguez de Mendoza", capital: "Mendoza", code: "0106" },
    { name: "Utcubamba", capital: "Bagua Grande", code: "0107" },
  ],
  Ancash: [
    { name: "Huaraz", capital: "Huaraz", code: "0201" },
    { name: "Aija", capital: "Aija", code: "0202" },
    { name: "Antonio Raymondi", capital: "Llamellin", code: "0203" },
    { name: "Asuncion", capital: "Chacas", code: "0204" },
    { name: "Bolognesi", capital: "Chiquian", code: "0205" },
    { name: "Carhuaz", capital: "Carhuaz", code: "0206" },
    { name: "Carlos Fermin Fitzcarrald", capital: "San Luis", code: "0207" },
    { name: "Casma", capital: "Casma", code: "0208" },
    { name: "Corongo", capital: "Corongo", code: "0209" },
    { name: "Huari", capital: "Huari", code: "0210" },
    { name: "Huarmey", capital: "Huarmey", code: "0211" },
    { name: "Huaylas", capital: "Caraz", code: "0212" },
    { name: "Mariscal Luzuriaga", capital: "Piscobamba", code: "0213" },
    { name: "Ocros", capital: "Ocros", code: "0214" },
    { name: "Pallasca", capital: "Cabana", code: "0215" },
    { name: "Pomabamba", capital: "Pomabamba", code: "0216" },
    { name: "Recuay", capital: "Recuay", code: "0217" },
    { name: "Santa", capital: "Chimbote", code: "0218" },
    { name: "Sihuas", capital: "Sihuas", code: "0219" },
    { name: "Yungay", capital: "Yungay", code: "0220" },
  ],
  Apurimac: [
    { name: "Abancay", capital: "Abancay", code: "0301" },
    { name: "Andahuaylas", capital: "Andahuaylas", code: "0302" },
    { name: "Antabamba", capital: "Antabamba", code: "0303" },
    { name: "Aymaraes", capital: "Chalhuanca", code: "0304" },
    { name: "Cotabambas", capital: "Tambobamba", code: "0305" },
    { name: "Chincheros", capital: "Chincheros", code: "0306" },
    { name: "Grau", capital: "Chuquibambilla", code: "0307" },
  ],
  Arequipa: [
    { name: "Arequipa", capital: "Arequipa", code: "0401" },
    { name: "Camana", capital: "Camana", code: "0402" },
    { name: "Caraveli", capital: "Caraveli", code: "0403" },
    { name: "Castilla", capital: "Aplao", code: "0404" },
    { name: "Caylloma", capital: "Chivay", code: "0405" },
    { name: "Condesuyos", capital: "Chuquibamba", code: "0406" },
    { name: "Islay", capital: "Mollendo", code: "0407" },
    { name: "La Union", capital: "Cotahuasi", code: "0408" },
  ],
  Ayacucho: [
    { name: "Huamanga", capital: "Ayacucho", code: "0501" },
    { name: "Cangallo", capital: "Cangallo", code: "0502" },
    { name: "Huanca Sancos", capital: "Huanca Sancos", code: "0503" },
    { name: "Huanta", capital: "Huanta", code: "0504" },
    { name: "La Mar", capital: "San Miguel", code: "0505" },
    { name: "Lucanas", capital: "Puquio", code: "0506" },
    { name: "Parinacochas", capital: "Coracora", code: "0507" },
    { name: "Paucar del Sara Sara", capital: "Pausa", code: "0508" },
    { name: "Sucre", capital: "Querobamba", code: "0509" },
    { name: "Victor Fajardo", capital: "Huancapi", code: "0510" },
    { name: "Vilcas Huaman", capital: "Vilcashuaman", code: "0511" },
  ],
  Cajamarca: [
    { name: "Cajamarca", capital: "Cajamarca", code: "0601" },
    { name: "Cajabamba", capital: "Cajabamba", code: "0602" },
    { name: "Celendin", capital: "Celendin", code: "0603" },
    { name: "Chota", capital: "Chota", code: "0604" },
    { name: "Contumaza", capital: "Contumaza", code: "0605" },
    { name: "Cutervo", capital: "Cutervo", code: "0606" },
    { name: "Hualgayoc", capital: "Bambamarca", code: "0607" },
    { name: "Jaen", capital: "Jaen", code: "0608" },
    { name: "San Ignacio", capital: "San Ignacio", code: "0609" },
    { name: "San Marcos", capital: "San Marcos", code: "0610" },
    { name: "San Miguel", capital: "San Miguel de Pallaques", code: "0611" },
    { name: "San Pablo", capital: "San Pablo", code: "0612" },
    { name: "Santa Cruz", capital: "Santa Cruz de Succhubamba", code: "0613" },
  ],
  Callao: [{ name: "Callao", capital: "Callao", code: "0701" }],
  Cusco: [
    { name: "Cusco", capital: "Cusco", code: "0801" },
    { name: "Acomayo", capital: "Acomayo", code: "0802" },
    { name: "Anta", capital: "Anta", code: "0803" },
    { name: "Calca", capital: "Calca", code: "0804" },
    { name: "Canas", capital: "Yanaoca", code: "0805" },
    { name: "Canchis", capital: "Sicuani", code: "0806" },
    { name: "Chumbivilcas", capital: "Santo Tomas", code: "0807" },
    { name: "Espinar", capital: "Yauri", code: "0808" },
    { name: "La Convencion", capital: "Quillabamba", code: "0809" },
    { name: "Paruro", capital: "Paruro", code: "0810" },
    { name: "Paucartambo", capital: "Paucartambo", code: "0811" },
    { name: "Quispicanchi", capital: "Urcos", code: "0812" },
    { name: "Urubamba", capital: "Urubamba", code: "0813" },
  ],
  Huancavelica: [
    { name: "Huancavelica", capital: "Huancavelica", code: "0901" },
    { name: "Acobamba", capital: "Acobamba", code: "0902" },
    { name: "Angaraes", capital: "Lircay", code: "0903" },
    { name: "Castrovirreyna", capital: "Castrovirreyna", code: "0904" },
    { name: "Churcampa", capital: "Churcampa", code: "0905" },
    { name: "Huaytara", capital: "Huaytara", code: "0906" },
    { name: "Tayacaja", capital: "Pampas", code: "0907" },
  ],
  Huanuco: [
    { name: "Huanuco", capital: "Huanuco", code: "1001" },
    { name: "Ambo", capital: "Ambo", code: "1002" },
    { name: "Dos de Mayo", capital: "La Union", code: "1003" },
    { name: "Huacaybamba", capital: "Huacaybamba", code: "1004" },
    { name: "Huamalies", capital: "Llata", code: "1005" },
    { name: "Leoncio Prado", capital: "Tingo Maria", code: "1006" },
    { name: "Maranon", capital: "Huacrachuco", code: "1007" },
    { name: "Pachitea", capital: "Panao", code: "1008" },
    { name: "Puerto Inca", capital: "Puerto Inca", code: "1009" },
    { name: "Lauricocha", capital: "Jesus", code: "1010" },
    { name: "Yarowilca", capital: "Chavinillo", code: "1011" },
  ],
  Ica: [
    { name: "Ica", capital: "Ica", code: "1101" },
    { name: "Chincha", capital: "Chincha Alta", code: "1102" },
    { name: "Nazca", capital: "Nazca", code: "1103" },
    { name: "Palpa", capital: "Palpa", code: "1104" },
    { name: "Pisco", capital: "Pisco", code: "1105" },
  ],
  Junin: [
    { name: "Huancayo", capital: "Huancayo", code: "1201" },
    { name: "Concepcion", capital: "Concepcion", code: "1202" },
    { name: "Chanchamayo", capital: "La Merced", code: "1203" },
    { name: "Jauja", capital: "Jauja", code: "1204" },
    { name: "Junin", capital: "Junin", code: "1205" },
    { name: "Satipo", capital: "Satipo", code: "1206" },
    { name: "Tarma", capital: "Tarma", code: "1207" },
    { name: "Yauli", capital: "La Oroya", code: "1208" },
    { name: "Chupaca", capital: "Chupaca", code: "1209" },
  ],
  "La Libertad": [
    { name: "Trujillo", capital: "Trujillo", code: "1301" },
    { name: "Ascope", capital: "Ascope", code: "1302" },
    { name: "Bolivar", capital: "Bolivar", code: "1303" },
    { name: "Chepen", capital: "Chepen", code: "1304" },
    { name: "Julcan", capital: "Julcan", code: "1305" },
    { name: "Otuzco", capital: "Otuzco", code: "1306" },
    { name: "Pacasmayo", capital: "San Pedro de Lloc", code: "1307" },
    { name: "Pataz", capital: "Tayabamba", code: "1308" },
    { name: "Sanchez Carrion", capital: "Huamachuco", code: "1309" },
    { name: "Santiago de Chuco", capital: "Santiago de Chuco", code: "1310" },
    { name: "Gran Chimu", capital: "Cascas", code: "1311" },
    { name: "Viru", capital: "Viru", code: "1312" },
  ],
  Lambayeque: [
    { name: "Chiclayo", capital: "Chiclayo", code: "1401" },
    { name: "Ferrenafe", capital: "Ferrenafe", code: "1402" },
    { name: "Lambayeque", capital: "Lambayeque", code: "1403" },
  ],
  Lima: [
    { name: "Lima", capital: "Lima", code: "1501" },
    { name: "Barranca", capital: "Barranca", code: "1502" },
    { name: "Cajatambo", capital: "Cajatambo", code: "1503" },
    { name: "Canta", capital: "Canta", code: "1504" },
    { name: "Canete", capital: "San Vicente de Canete", code: "1505" },
    { name: "Huaral", capital: "Huaral", code: "1506" },
    { name: "Huarochiri", capital: "Matucana", code: "1507" },
    { name: "Huaura", capital: "Huacho", code: "1508" },
    { name: "Oyon", capital: "Oyon", code: "1509" },
    { name: "Yauyos", capital: "Yauyos", code: "1510" },
  ],
  Loreto: [
    { name: "Maynas", capital: "Iquitos", code: "1601" },
    { name: "Alto Amazonas", capital: "Yurimaguas", code: "1602" },
    { name: "Loreto", capital: "Nauta", code: "1603" },
    { name: "Mariscal Ramon Castilla", capital: "Caballococha", code: "1604" },
    { name: "Putumayo", capital: "San Antonio del Estrecho", code: "1605" },
    { name: "Requena", capital: "Requena", code: "1606" },
    { name: "Ucayali", capital: "Contamana", code: "1607" },
    { name: "Datem del Maranon", capital: "San Lorenzo", code: "1608" },
  ],
  "Madre de Dios": [
    { name: "Tambopata", capital: "Puerto Maldonado", code: "1701" },
    { name: "Manu", capital: "Salvacion", code: "1702" },
    { name: "Tahuamanu", capital: "Inapari", code: "1703" },
  ],
  Moquegua: [
    { name: "Mariscal Nieto", capital: "Moquegua", code: "1801" },
    { name: "General Sanchez Cerro", capital: "Omate", code: "1802" },
    { name: "Ilo", capital: "Ilo", code: "1803" },
  ],
  Pasco: [
    { name: "Pasco", capital: "Cerro de Pasco", code: "1901" },
    { name: "Daniel Alcides Carrion", capital: "Yanahuanca", code: "1902" },
    { name: "Oxapampa", capital: "Oxapampa", code: "1903" },
  ],
  Piura: [
    { name: "Piura", capital: "Piura", code: "2001" },
    { name: "Ayabaca", capital: "Ayabaca", code: "2002" },
    { name: "Huancabamba", capital: "Huancabamba", code: "2003" },
    { name: "Morropon", capital: "Chulucanas", code: "2004" },
    { name: "Paita", capital: "Paita", code: "2005" },
    { name: "Sullana", capital: "Sullana", code: "2006" },
    { name: "Talara", capital: "Talara", code: "2007" },
    { name: "Sechura", capital: "Sechura", code: "2008" },
  ],
  Puno: [
    { name: "Puno", capital: "Puno", code: "2101" },
    { name: "Azangaro", capital: "Azangaro", code: "2102" },
    { name: "Carabaya", capital: "Macusani", code: "2103" },
    { name: "Chucuito", capital: "Juli", code: "2104" },
    { name: "El Collao", capital: "Ilave", code: "2105" },
    { name: "Huancane", capital: "Huancane", code: "2106" },
    { name: "Lampa", capital: "Lampa", code: "2107" },
    { name: "Melgar", capital: "Ayaviri", code: "2108" },
    { name: "Moho", capital: "Moho", code: "2109" },
    { name: "San Antonio de Putina", capital: "Putina", code: "2110" },
    { name: "San Roman", capital: "Juliaca", code: "2111" },
    { name: "Sandia", capital: "Sandia", code: "2112" },
    { name: "Yunguyo", capital: "Yunguyo", code: "2113" },
  ],
  "San Martin": [
    { name: "Moyobamba", capital: "Moyobamba", code: "2201" },
    { name: "Bellavista", capital: "Bellavista", code: "2202" },
    { name: "El Dorado", capital: "San Jose de Sisa", code: "2203" },
    { name: "Huallaga", capital: "Saposoa", code: "2204" },
    { name: "Lamas", capital: "Lamas", code: "2205" },
    { name: "Mariscal Caceres", capital: "Juanjui", code: "2206" },
    { name: "Picota", capital: "Picota", code: "2207" },
    { name: "Rioja", capital: "Rioja", code: "2208" },
    { name: "San Martin", capital: "Tarapoto", code: "2209" },
    { name: "Tocache", capital: "Tocache", code: "2210" },
  ],
  Tacna: [
    { name: "Tacna", capital: "Tacna", code: "2301" },
    { name: "Candarave", capital: "Candarave", code: "2302" },
    { name: "Jorge Basadre", capital: "Locumba", code: "2303" },
    { name: "Tarata", capital: "Tarata", code: "2304" },
  ],
  Tumbes: [
    { name: "Tumbes", capital: "Tumbes", code: "2401" },
    { name: "Contralmirante Villar", capital: "Zorritos", code: "2402" },
    { name: "Zarumilla", capital: "Zarumilla", code: "2403" },
  ],
  Ucayali: [
    { name: "Coronel Portillo", capital: "Pucallpa", code: "2501" },
    { name: "Atalaya", capital: "Atalaya", code: "2502" },
    { name: "Padre Abad", capital: "Aguaytia", code: "2503" },
    { name: "Purus", capital: "Esperanza", code: "2504" },
  ],
};

function mergeUbigeo(baseDepartments: UbigeoDepartment[], provinceCapitals: Record<string, ProvinceCapital[]>) {
  const departments = baseDepartments.map((department) => ({
    ...department,
    provinces: department.provinces.map((province) => ({
      ...province,
      districts: [...province.districts],
    })),
  }));

  for (const [departmentName, provinces] of Object.entries(provinceCapitals)) {
    let department = departments.find((item) => item.name === departmentName);

    if (!department) {
      department = { name: departmentName, provinces: [] };
      departments.push(department);
    }

    for (const provinceCapital of provinces) {
      let province = department.provinces.find((item) => item.name === provinceCapital.name);
      const capitalDistrict = { name: provinceCapital.capital, code: `${provinceCapital.code}01` };

      if (!province) {
        province = { name: provinceCapital.name, districts: [capitalDistrict] };
        department.provinces.push(province);
        continue;
      }

      if (!province.districts.some((district) => district.code === capitalDistrict.code)) {
        province.districts.push(capitalDistrict);
      }
    }

    department.provinces.sort((left, right) => left.name.localeCompare(right.name));
  }

  return departments.sort((left, right) => left.name.localeCompare(right.name));
}

export const PERU_UBIGEO: UbigeoDepartment[] = mergeUbigeo(BASE_PERU_UBIGEO, PROVINCE_CAPITALS_BY_DEPARTMENT);