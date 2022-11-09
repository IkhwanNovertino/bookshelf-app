const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, h) => {
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = req.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);

    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;

  const newBooks = {
    id, name, year, author, summary,
    publisher, pageCount, readPage, reading,
    finished, insertedAt, updatedAt,
  };

  books.push(newBooks);

  const isSuccess = books.filter((el) => el.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);

    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);

  return response;
};

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;

  if (reading) {
    const bookIsReading = books.filter((el) => Number(el.reading) === Number(reading));

    const response = h.response({
      status: 'success',
      data: {
        books: bookIsReading.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);

    return response;
  }

  if (finished) {
    const bookIsFinished = books.filter((el) => Number(el.finished) === Number(finished));

    const response = h.response({
      status: 'success',
      data: {
        books: bookIsFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);

    return response;
  }

  if (name) {
    const getBookByName = books.filter((el) => {
      const result = new RegExp(name, 'i');
      return result.exec(el.name);
    });

    const response = h.response({
      status: 'success',
      data: {
        books: getBookByName.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);

    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((el) => ({
        id: el.id,
        name: el.name,
        publisher: el.publisher,
      })),
    },
  });
  return response;
};

const getBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const book = books.filter((el) => el.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  })
    .code(404);
  return response;
};

const updateBookHandler = (req, h) => {
  const { id } = req.params;

  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = req.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);

    return response;
  }

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((el) => el.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);

  return response;
};

const deleteBookHandler = (req, h) => {
  const { id } = req.params;

  const index = books.findIndex((el) => el.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
      .code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  })
    .code(404);

  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
};