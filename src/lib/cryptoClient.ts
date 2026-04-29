let clientSecretKey = "";

export const setClientSecretKey = (key: string) => {
  clientSecretKey = key;
};

export const getClientSecretKey = () => clientSecretKey;
