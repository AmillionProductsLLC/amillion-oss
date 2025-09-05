Debian package amillion-oss-deb.deb.

  Here is how to use it:

   1. Transfer the package to a Debian-based Linux system (like Ubuntu).
   2. Install the package by running: sudo dpkg -i amillion-oss-deb.deb.
      This will install the backend server and run the post-installation
      script to install its Node.js dependencies.
   3. Build the Frontend: On a standard development machine (not the
      server), navigate to the amillion-oss/client directory and run npm
      run build.
   4. Deploy the Frontend: Copy the entire contents of the
      amillion-oss/client/dist directory to the
      /opt/amillion-oss/client/dist directory on your server.
   5. Start the Server: Run the command amillion-oss-start to launch the
      IDE server.
   6. Access the IDE: Open a web browser and navigate to
      http://<your-server-ip>:3001.
