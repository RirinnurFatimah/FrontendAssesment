import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import type { RegionData } from "../types";

function getInitialFilters(data: RegionData) {
  if (typeof window === "undefined") {
    return { province: null, regency: null, district: null };
  }
  const saved = localStorage.getItem("filters");
  if (!saved) return { province: null, regency: null, district: null };
  try {
    const f = JSON.parse(saved);
    const provinceExists = data.provinces.some((p) => p.id === f.province);
    const regencyExists = data.regencies.some((r) => r.id === f.regency);
    const districtExists = data.districts.some((d) => d.id === f.district);
    
    if (!provinceExists) return { province: null, regency: null, district: null };
    if (!regencyExists) return { province: f.province, regency: null, district: null };
    if (!districtExists) return { province: f.province, regency: f.regency, district: null };
    return { province: f.province, regency: f.regency, district: f.district };
  } catch {
    return { province: null, regency: null, district: null };
  }
}

export default function FilterPage() {
  const data = useLoaderData() as RegionData;
  const initialFilters = getInitialFilters(data);
  
  const [selectedProvince, setSelectedProvince] = useState<number | null>(initialFilters.province);
  const [selectedRegency, setSelectedRegency] = useState<number | null>(initialFilters.regency);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(initialFilters.district);

  const saveFilters = (province: number | null, regency: number | null, district: number | null) => {
    localStorage.setItem(
      "filters",
      JSON.stringify({ province, regency, district })
    );
  };

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

  const handleProvinceChange = (val: number | null) => {
    setSelectedProvince(val);
    setSelectedRegency(null);
    setSelectedDistrict(null);
    saveFilters(val, null, null);
  };

  const handleRegencyChange = (val: number | null) => {
    setSelectedRegency(val);
    setSelectedDistrict(null);
    saveFilters(selectedProvince, val, null);
  };

  const handleDistrictChange = (val: number | null) => {
    setSelectedDistrict(val);
    saveFilters(selectedProvince, selectedRegency, val);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-full lg:w-80 lg:h-screen lg:fixed lg:left-0 lg:top-0 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col shrink-0 order-2 lg:order-1">
        <div className="px-4 lg:px-6 py-4 lg:py-6 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-800">Frontend Assessment</h1>
        </div>
        <div className="px-4 lg:px-6 py-4 lg:py-6 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 tracking-widest mb-5">FILTER WILAYAH</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">Provinsi</label>
              <select
                name="province"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedProvince ?? ""}
                onChange={(e) => handleProvinceChange(Number(e.target.value) || null)}
              >
                <option value="">Pilih Provinsi</option>
                {data.provinces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">Kota/Kabupaten</label>
              <select
                name="regency"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm disabled:opacity-50"
                value={selectedRegency ?? ""}
                disabled={!selectedProvince}
                onChange={(e) => handleRegencyChange(Number(e.target.value) || null)}
              >
                <option value="">Pilih Kota/Kabupaten</option>
                {filteredRegencies.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-600 mb-2">Kecamatan</label>
              <select
                name="district"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm disabled:opacity-50"
                value={selectedDistrict ?? ""}
                disabled={!selectedRegency}
                onChange={(e) => handleDistrictChange(Number(e.target.value) || null)}
              >
                <option value="">Pilih Kecamatan</option>
                {filteredDistricts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="w-full border-2 border-blue-500 text-blue-600 rounded-lg py-2.5 font-medium hover:bg-blue-50 transition"
          >
            Reset
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col order-1 lg:order-2 lg:ml-80">
        {/* Breadcrumb */}
        <div className="breadcrumb bg-white border-b border-gray-200 py-4 lg:py-5 px-4 lg:px-8">
          <div className="text-sm text-gray-500">
            Indonesia
            {provinceName && ` › ${provinceName}`}
            {regencyName && ` › ${regencyName}`}
            {districtName && ` › ${districtName}`}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 lg:p-8">
          <div className="text-center space-y-8 lg:space-y-10">
            {provinceName && (
              <div className="space-y-2">
                <p className="text-xs tracking-[0.3em] text-blue-500 font-semibold">PROVINSI</p>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">{provinceName}</h1>
              </div>
            )}
            {provinceName && regencyName && <div className="text-gray-400 text-2xl lg:text-3xl">↓</div>}
            {regencyName && (
              <div className="space-y-2">
                <p className="text-xs tracking-[0.3em] text-blue-500 font-semibold">KOTA / KABUPATEN</p>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{regencyName}</h1>
              </div>
            )}
            {regencyName && districtName && <div className="text-gray-400 text-2xl lg:text-3xl">↓</div>}
            {districtName && (
              <div className="space-y-2">
                <p className="text-xs tracking-[0.3em] text-blue-500 font-semibold">KECAMATAN</p>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{districtName}</h1>
              </div>
            )}
            {!provinceName && <p className="text-gray-400 text-lg">Silakan pilih filter wilayah</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
