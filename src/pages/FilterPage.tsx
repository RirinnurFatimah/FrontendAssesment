import { useState, useEffect } from "react";
import regionData from "../data/indonesia_regions.json";

type Province = { id: number; name: string };
type Regency = { id: number; name: string; province_id: number };
type District = { id: number; name: string; regency_id: number };

type RegionData = {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
};

type FilterState = {
  province: number | null;
  regency: number | null;
  district: number | null;
};

function getInitialFilters(): FilterState {
  if (typeof window === "undefined") {
    return { province: null, regency: null, district: null };
  }

  const saved = localStorage.getItem("filters");
  if (!saved) return { province: null, regency: null, district: null };

  try {
    return JSON.parse(saved);
  } catch {
    return { province: null, regency: null, district: null };
  }
}

export default function FilterPage() {
  const initialFilters = getInitialFilters();
  const [data] = useState<RegionData>(regionData);

  const [selectedProvince, setSelectedProvince] = useState<number | null>(initialFilters.province);
  const [selectedRegency, setSelectedRegency] = useState<number | null>(initialFilters.regency);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(initialFilters.district);

  useEffect(() => {
    localStorage.setItem(
      "filters",
      JSON.stringify({
        province: selectedProvince,
        regency: selectedRegency,
        district: selectedDistrict,
      })
    );
  }, [selectedProvince, selectedRegency, selectedDistrict]);

  const filteredRegencies = selectedProvince
    ? data.regencies.filter((r) => r.province_id === selectedProvince)
    : [];

  const filteredDistricts = selectedRegency
    ? data.districts.filter((d) => d.regency_id === selectedRegency)
    : [];

  const resetFilters = () => {
    setSelectedProvince(null);
    setSelectedRegency(null);
    setSelectedDistrict(null);
    localStorage.removeItem("filters");
  };

  const provinceName = data.provinces.find((p) => p.id === selectedProvince)?.name;
  const regencyName = data.regencies.find((r) => r.id === selectedRegency)?.name;
  const districtName = data.districts.find((d) => d.id === selectedDistrict)?.name;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-full lg:w-96 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">

        {/* HEADER */}
        <div className="px-4 lg:px-8 py-4 lg:py-6 border-b border-gray-200">
          <h1 className="text-lg lg:text-xl font-bold text-gray-800">
            Frontend Assessment
          </h1>
        </div>

        {/* FILTER AREA */}
        <div className="px-4 lg:px-8 py-4 lg:py-8 flex-1 flex flex-col justify-between">

          <div>
            <p className="text-xs font-semibold text-gray-400 tracking-widest mb-6 lg:mb-8">
              FILTER WILAYAH
            </p>

            {/* PROVINSI */}
            <div className="mb-4 lg:mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Provinsi
              </label>
              <select
                name="province"
                className="w-full border border-gray-300 rounded-xl px-3 lg:px-4 py-2.5 lg:py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedProvince ?? ""}
                onChange={(e) => {
                  const val = Number(e.target.value) || null;
                  setSelectedProvince(val);
                  setSelectedRegency(null);
                  setSelectedDistrict(null);
                }}
              >
                <option value="">Pilih Provinsi</option>
                {data.provinces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* KOTA/KABUPATEN */}
            <div className="mb-4 lg:mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Kota/Kabupaten
              </label>
              <select
                name="regency"
                className="w-full border border-gray-300 rounded-xl px-3 lg:px-4 py-2.5 lg:py-3 text-sm disabled:opacity-50"
                value={selectedRegency ?? ""}
                disabled={!selectedProvince}
                onChange={(e) => {
                  const val = Number(e.target.value) || null;
                  setSelectedRegency(val);
                  setSelectedDistrict(null);
                }}
              >
                <option value="">Pilih Kota/Kabupaten</option>
                {filteredRegencies.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* KECAMATAN */}
            <div className="mb-6 lg:mb-10">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Kecamatan
              </label>
              <select
                name="district"
                className="w-full border border-gray-300 rounded-xl px-3 lg:px-4 py-2.5 lg:py-3 text-sm disabled:opacity-50"
                value={selectedDistrict ?? ""}
                disabled={!selectedRegency}
                onChange={(e) =>
                  setSelectedDistrict(Number(e.target.value) || null)
                }
              >
                <option value="">Pilih Kecamatan</option>
                {filteredDistricts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* RESET */}
          <button
            onClick={resetFilters}
            className="w-full border-2 border-blue-500 text-blue-600 rounded-xl py-2.5 lg:py-3 font-medium hover:bg-blue-50 transition"
          >
            Reset
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">

        {/* BREADCRUMB */}
        <div className="breadcrumb bg-white border-b border-gray-200 py-4 lg:py-6">
        <div className="px-4 lg:px-16 text-sm text-gray-500">
          Indonesia
          {provinceName && ` › ${provinceName}`}
          {regencyName && ` › ${regencyName}`}
          {districtName && ` › ${districtName}`}
        </div>
      </div>

        {/* CONTENT */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 lg:p-8">

          <div className="text-center space-y-8 lg:space-y-14">

            {provinceName && (
              <div className="space-y-2 lg:space-y-3">
                <p className="text-xs tracking-[0.3em] text-blue-500 font-semibold">
                  PROVINSI
                </p>
                <h1 className="text-3xl lg:text-6xl font-bold text-gray-800">
                  {provinceName}
                </h1>
              </div>
            )}

            {provinceName && regencyName && (
              <div className="text-gray-400 text-2xl lg:text-3xl">↓</div>
            )}

            {regencyName && (
              <div className="space-y-2 lg:space-y-3">
                <p className="text-xs tracking-[0.3em] text-blue-500 font-semibold">
                  KOTA / KABUPATEN
                </p>
                <h1 className="text-2xl lg:text-5xl font-bold text-gray-800">
                  {regencyName}
                </h1>
              </div>
            )}

            {regencyName && districtName && (
              <div className="text-gray-400 text-2xl lg:text-3xl">↓</div>
            )}

            {districtName && (
              <div className="space-y-2 lg:space-y-3">
                <p className="text-xs tracking-[0.3em] text-blue-500 font-semibold">
                  KECAMATAN
                </p>
                <h1 className="text-xl lg:text-4xl font-bold text-gray-800">
                  {districtName}
                </h1>
              </div>
            )}

            {!provinceName && (
              <p className="text-gray-400 text-base lg:text-lg">
                Silakan pilih filter wilayah
              </p>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
