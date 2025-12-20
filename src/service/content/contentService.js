import {
  countPinnedContent,
  deleteContentById,
  getContentById,
  getContentList,
  getTrendingContent,
  insertContent,
  updateContentById,
  updateContentPinById,
  getPinnedContent,
} from "../../repository/contentRepository.js";
import { getParameterByKey } from "../../repository/parameterRepository.js";
import { createNotification } from "../../repository/notificationRepository.js";

export const addContent = async (data) => {
  const { title, categoryId, contentDetail, linkPath, imageId } = data;

  if (!title || !categoryId || !contentDetail || !linkPath) {
    throw { status: 400, message: "Missing required fields." };
  }

  const notificationParam = await getParameterByKey(
    "CONTENT_NOTIFICATION_TITLE"
  );
  const notificationTitle = notificationParam
    ? notificationParam.param_value
    : "New Content Published";

  const content = await insertContent({
    title,
    categoryId,
    contentDetail,
    linkPath,
    imageId,
  });

  await createNotification({
    userId: null,
    title: notificationTitle,
    detail: `Check out our latest content: ${title}`,
    link: `/content/${content.id}`,
  });

  return formatContentResponse(content);
};

export const fetchContentById = async (id) => {
  const content = await getContentById(id);
  if (!content) throw { status: 404, message: "Content not found." };
  const response = formatContentResponse(content);
  if (response.imageLink !== null) {
    const match = response.imageLink.match(/[0-9a-fA-F\-]{36}/);
    if (match) {
      const uuid = match[0];
      response.imageId = uuid;
    }
  }
  return response;
};

export const fetchContentList = async (
  limit,
  offset,
  search,
  sortBy,
  sortDirection,
  categoryId
) => {
  const contents = await getContentList(
    limit,
    offset,
    search,
    sortBy,
    sortDirection,
    categoryId
  );

  return {
    contents: contents.contents.map(formatContentResponses),
    pagination: {
      total: contents.pagination.total,
      totalPages: contents.pagination.totalPages,
      currentPage: contents.pagination.currentPage,
      size: contents.pagination.size,
    },
  };
};

export const fetchTrendingContent = async (
  limit,
  offset,
  lastCount,
  categoryId
) => {
  const contents = await getTrendingContent(
    limit,
    offset,
    lastCount,
    categoryId
  );

  return {
    contents: contents.contents.map(formatContentResponses),
    pagination: {
      total: contents.pagination.total,
      totalPages: contents.pagination.totalPages,
      currentPage: contents.pagination.currentPage,
      size: contents.pagination.size,
    },
  };
};

export const fetchPinnedContent = async (
) => {
  const contents = await getPinnedContent();

  return {
    contents: contents.contents.map(formatContentResponses),

  };
};

export const modifyContent = async (id, data) => {
  const { title, categoryId, contentDetail, linkPath, imageId } = data;

  if (!title || !categoryId || !contentDetail || !linkPath) {
    throw { status: 400, message: "Missing required fields." };
  }

  const updatedContent = await updateContentById(id, {
    title,
    categoryId,
    contentDetail,
    linkPath,
    imageId,
  });

  return formatContentResponse(updatedContent);
};

export const modifyContentUpdatePin = async (id, data) => {
  const { is_pin } = data;
  const countPin = await countPinnedContent();
  console.log(is_pin, countPin)
  if (countPin >= 5 && is_pin) {
    throw { status: 400, message: "Maksimal 5 Berita Edukasi yang dipin" };
  }

  const updatedContent = await updateContentPinById(id, { is_pin });
  return formatContentResponse(updatedContent);
};

export const removeContent = async (id) => {
  await deleteContentById(id);
};

// ✅ Helper function to format response in camelCase
const formatContentResponse = (content) => ({
  id: content.id,
  title: content.title,
  categoryId: content.category_id,
  categoryName: content.category_name,
  isPin: content.is_pin,
  contentDetail: content.content_detail,
  linkPath: content.link_path,
  imageLink: content.image_id
    ? `/file/image/${content.image_id}`
    : content.image_link,
  createdDate: content.created_date,
  updatedDate: content.updated_date,
});

const formatContentResponses = (content) => {
  return {
    id: content.id,
    title: content.title,
    category: content.category_name,
    linkPath: content.link_path,
    createdDate: content.created_date,
    imageLink: content.image_link,
    isPin: content.is_pin,
    viewCount: parseInt(content.view_count || "0", 10), // Add view count to response
  };
};
