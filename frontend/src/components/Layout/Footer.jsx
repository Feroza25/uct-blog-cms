const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold">BlogCMS</h3>
            <p className="text-gray-400 mt-2">Create, Manage, and Publish with Ease</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Blog Content Management System
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Built with React, Node.js, and MongoDB
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;