import lighthouse from "@lighthouse-web3/sdk";

export const uploadToLighthouse = async (files, metadata) => {
  // Lấy key từ env
  const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY;

  // Upload nhiều file
  const formData = new FormData();
  files.forEach(file => formData.append("file", file));

  // Metadata thêm vào JSON nếu muốn
  formData.append("name", metadata.title || "My NFT");
  formData.append("description", metadata.detail || "");

  try {
    const response = await lighthouse.upload(formData, apiKey);
    console.log("Lighthouse response:", response);

    // Trả về URL IPFS
    return `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
  } catch (err) {
    console.error("Lighthouse upload error:", err);
    throw err;
  }
};
