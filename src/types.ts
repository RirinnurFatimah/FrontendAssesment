export type Province = { id: number; name: string };
export type Regency = { id: number; name: string; province_id: number };
export type District = { id: number; name: string; regency_id: number };

export type RegionData = {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
};

export type FilterState = {
  province: number | null;
  regency: number | null;
  district: number | null;
};
