import axios from 'axios';
import PDFDocument from 'pdfkit';


export const generateMoviesPDF = (movies: any[], currentPage: number, totalPages: number = 500): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];
  
      doc.on('data', data => buffers.push(data));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', err => reject(err));
  
      let y = 80;
      doc.fontSize(20).text('Popular Movies:', 225, 40, { underline: true });
  
      const detailFontSize = 10;
  
      let index = 1;
      movies.forEach(movie => {
        doc.fontSize(14)
          .fillColor('black')
          .text(movie.title, 100, y, {
            link: `http://localhost:${process.env.PORT}/movies/${movie.id}`,
            underline: false
          });
  
        doc.fontSize(detailFontSize)
          .fillColor('#666')  
          .text(`Release Date: ${movie.release_date}`, 100, y + 15)
          .text(`Rating: ${movie.vote_average}`, 0, y+5, {
            align: 'right',
            continued: false
          });
  
        if(index === movies.length) { y+= 20}
        y += 30;
        index++
      });
  
      if (currentPage > 1) {
        doc.fontSize(14)
          .fillColor('blue')
          .text('First Page', 80, y, {
            link: `http://localhost:${process.env.PORT}/movies?page=1`,
            underline: true,
          align: 'left'
          });
        doc.text('Previous Page', 200, y, {
          link: `http://localhost:${process.env.PORT}/movies?page=${currentPage - 1}`,
          underline: true,
          align: 'center'
        });
      }
  
      if (currentPage < totalPages) {
        doc.fontSize(14)
          .fillColor('blue')
          .text('Next Page', 200, y, {
            link: `http://localhost:${process.env.PORT}/movies?page=${currentPage + 1}`,
            underline: true,
          });
        doc.text('Last Page', 200, y, {
          link: `http://localhost:${process.env.PORT}/movies?page=${totalPages}`,
          underline: true,
          align: 'right'
        });
      }
  
      doc.end();
    });
  };


export const generatePDF = async (movie: any):  Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Uint8Array[] = [];
  
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', (err) => reject(err));

      doc.fontSize(25).text(movie.title, { underline: true });
      doc.fontSize(16).text(`Release Date: ${movie.release_date}`);
      doc.text(`Rating: ${movie.vote_average}`);
  
      if (movie.poster_path) {
        const imageUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
        axios.get(imageUrl, { responseType: 'arraybuffer' })
          .then(response => {
            doc.image(Buffer.from(response.data), {
              fit: [250, 300],
              align: 'center',
              valign: 'center'
            });
            doc.end();
          }).catch(err => {
            console.error('Failed to load image:', err);
            doc.end();
          });
      } else {
        doc.end();
      }
    });
  };