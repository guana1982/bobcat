import { compose, withState, withHandlers, withProps } from "recompose";

export default (elementsPerPage = 5) =>
  compose(
    withState("page", "setPage", ({ initialPage = 1 }) => initialPage),
    withProps(ownProps => ({
      ...ownProps,
      totalPages: Math.ceil(
        ownProps.elementsAccessor(ownProps).length / (ownProps.elementsPerPage || elementsPerPage)
      )
    })),
    withHandlers({
      nextPage: ({ setPage, totalPages }) => e => {
        setPage(current => (current + 1 > totalPages ? 1 : current + 1));
      },
      prevPage: ({ setPage, totalPages }) => e => {
        setPage(current => (current - 1 < 1 ? totalPages : current - 1));
      },
      jumpTo: ({ setPage }) => page => {
        setPage(page);
      }
    })
  );
