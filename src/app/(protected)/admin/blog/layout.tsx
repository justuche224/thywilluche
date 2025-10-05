import React from "react";

const AdminBlogLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="container mx-auto px-4 py-16">{children}</div>;
};

export default AdminBlogLayout;
