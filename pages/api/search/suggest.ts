import { STATUS } from "constants/status";
import type { NextApiRequest, NextApiResponse } from "next";
import axiosLoklok from "configs/axiosLoklok";
import catchAsync from "utils/catch-async";
import { ApiError, responseError, responseSuccess } from "utils/response";
import { PATH_API } from "configs/path.api";

const getSuggestApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query } = req;
  const { keyword, size = 10 } = query;
  if (method !== "GET") {
    const error = new ApiError(STATUS.METHOD_NOT_ALLOWED, "Method not allowed");
    return responseError(error, res);
  }
  const { data } = await axiosLoklok.post(PATH_API.searchSuggest, {
    searchKeyWord: keyword,
    size,
  });
  const results = data.searchResults;
  const response = {
    message: "Get search keywords successfully !",
    data: results,
  };
  responseSuccess(res, response);
};

export default catchAsync(getSuggestApi);