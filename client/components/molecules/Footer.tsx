import React from 'react'

export const Footer: React.FC = () =>{
  return (
    <>
      <div className="mt-2 py-2 text-teal-500 text-center text-2xl font-semibold border-t border-gray-300">Contact Us</div>
      <div >
        <script src="https://apps.elfsight.com/p/platform.js" defer></script>
        <div className="elfsight-app-55e5f807-1fc5-4573-a1b9-eb0951b9d5b6"></div>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5428.172420811978!2d24.935875797413665!3d60.17190184934334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bcd01b0ed3f%3A0xdd8213c51ec4c403!2sHelsinki!5e0!3m2!1sen!2sfi!4v1597421720892!5m2!1sen!2sfi"
        width="100%"
        height="450"
        frameborder="0"
        style={{ border: 0 }}
        allowfullscreen=""
        aria-hidden="false"
        tabindex="0"
      />
      <div className="text-center text-gray-500 text-sm m-6">&copy;2020 Bamboo Shop. All rights reserved.</div>
    </>
  )
}

