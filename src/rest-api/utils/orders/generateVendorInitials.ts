export const  getVendorInitials= (companyName:String) =>{
  return companyName
    .split(/\s+/) // split by spaces
    .map(word => word[0]?.toUpperCase()) // take first letter of each word
    .join('');
}