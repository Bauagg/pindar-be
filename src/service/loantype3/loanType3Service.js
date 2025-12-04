import { getLoanType3, updateLoanType } from "../../repository/loanType3Repository.js";


export const setLoanTypeValue = async (lenderId, value) => {
  const data = await getLoanType3();

  data[lenderId] = value;

  const update = await updateLoanType(data);
  return update;
};

export const getLoanTypeValueByLenderId = async (lenderId) => {
  const data = await getLoanType3();
  return data[lenderId] || null;
};
