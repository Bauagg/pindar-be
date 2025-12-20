import pool from "../../configuration/dbConfiguration.js";
import {
  countPinnedLender,
  deleteOtherLenderRelations,
  fetchPinnedLenders,
  insertOtherLender,
  updateFileUsage,
  updateLenderData,
  updateLenderDetail,
  updateLenderPinById,
  validateLenderExists,
  validateParamExist,
} from "../../repository/lenderRepository.js";

export const modifyLender = async (data, userEmail) => {
  const {
    id,
    lenderName,
    directLink,
    maxLoan,
    loanType,
    paymentType,
    maxTenor,
    additionalInformation,
    termsDocument,
    imageId,
    anotherLend,
    anotherLenderType,
  } = data;

  if (
    !id ||
    !lenderName ||
    !directLink ||
    !maxLoan ||
    !loanType ||
    !paymentType ||
    !maxTenor
  ) {
    throw { status: 400, message: "Missing required fields." };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await validateLenderExists(client, id);
    await validateParamExist(client, loanType, "LENDER_LOAN_TYPE");
    await validateParamExist(client, paymentType, "LENDER_PAYMENT_TYPE");

    await updateLenderData(client, {
      id,
      lenderName,
      directLink,
      maxLoan,
      loanType,
      paymentType,
      maxTenor,
      imageId,
      userEmail,
    });
    await updateLenderDetail(client, {
      id,
      additionalInformation,
      termsDocument,
    });

    await deleteOtherLenderRelations(client, id);
    await insertOtherLender(client, id, anotherLend, "ANOTHER");
    await insertOtherLender(client, id, anotherLenderType, "ANOTHER_TYPE");

    await updateFileUsage(client, imageId);

    await client.query("COMMIT");
    return { id };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const modifyContentUpdatePinLender = async (id, data) => {
  const { is_pin } = data;
  const countPin = await countPinnedLender();
  if (countPin >= 10 && is_pin) {
    throw {
      status: 400,
      message: "Maksimal 10 Aplikasi Pinjaman yang dipin",
    };
  }

  const updatedContent = await updateLenderPinById(id, { is_pin });
  return updatedContent;
};

export const fetchPinnedLender = async () => {
  const lenders = await fetchPinnedLenders();

  return {
    lenders:lenders.lenders
  };
};
