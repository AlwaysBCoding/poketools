export const toTitleCase = (str: string) => {
  return str.split("-").join(" ").replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export const displayPercentage = (x: number) => {
  return `${(x * 100).toFixed(2)}%`;
}
