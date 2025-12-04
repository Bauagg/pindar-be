import { getLoanType3, updateLenderLoanType, updateLoanType } from "../repository/loanType3Repository.js";
import { getLoanTypeValueByLenderId } from "../service/loantype3/loanType3Service.js";


export const getLoanType = async (req, res) => {
  try {
    const { lenderId } = req.params;
    const value = await getLoanTypeValueByLenderId(lenderId);

    res.json({
      lenderId,
      value,
      message: "Success",
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


export const updateLoanType3 = async (req, res) => {
  try {
    const { lenderId, value } = req.body;

    const existing = await getLoanType3();

  

  
    existing[lenderId] = value;

    
    await updateLoanType(existing);

    await updateLenderLoanType(lenderId, "LOAN_TYPE_3");

    return res.json({
      message: "LOAN_TYPE_3 updated and lender loan_type updated",
      data: existing,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

