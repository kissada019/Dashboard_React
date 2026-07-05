import provinces from "../data/thailand/provinces.json";
import districts from "../data/thailand/districts.json";
import subdistricts from "../data/thailand/subdistricts.json";

const sortByThaiName = (a, b) => a.label.localeCompare(b.label, "th");

export const provinceOptions = provinces
  .map((province) => ({
    code: province.provinceCode,
    label: province.provinceNameTh,
  }))
  .sort(sortByThaiName);

export const getProvinceByName = (provinceName) =>
  provinces.find((province) => province.provinceNameTh === provinceName);

export const getDistrictOptions = (provinceName) => {
  const province = getProvinceByName(provinceName);
  if (!province) return [];

  return districts
    .filter((district) => district.provinceCode === province.provinceCode)
    .map((district) => ({
      code: district.districtCode,
      label: district.districtNameTh,
      postalCode: district.postalCode,
    }))
    .sort(sortByThaiName);
};

export const getDistrictByName = (provinceName, districtName) => {
  const province = getProvinceByName(provinceName);
  if (!province) return null;

  return districts.find(
    (district) =>
      district.provinceCode === province.provinceCode &&
      district.districtNameTh === districtName
  );
};

export const getSubdistrictOptions = (provinceName, districtName) => {
  const district = getDistrictByName(provinceName, districtName);
  if (!district) return [];

  return subdistricts
    .filter((subdistrict) => subdistrict.districtCode === district.districtCode)
    .map((subdistrict) => ({
      code: subdistrict.subdistrictCode,
      label: subdistrict.subdistrictNameTh,
      postalCode: subdistrict.postalCode,
    }))
    .sort(sortByThaiName);
};

export const getSubdistrictByName = (provinceName, districtName, subdistrictName) =>
  getSubdistrictOptions(provinceName, districtName).find(
    (subdistrict) => subdistrict.label === subdistrictName
  );
