const redirectTo = (path: string, code: number) => {
  return new Response("Redirect", {
    status: code,
    headers: { "Location": path },
  });
};

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

export { redirectTo, responseDetails };
