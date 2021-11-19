import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore'

 function useDocumentDataSSR(ref:any, options:any) {
  const [value, loading, error] = useDocumentData(ref, options)

  if (options?.startWith && loading) {
    return [options.startWith, loading, error]
  } else {
    return [value, loading, error]
  }

}

function useCollectionDataSSR(ref:any, options:any) {
  const [value, loading, error] = useCollectionData(ref, options)

  if (options?.startWith && loading) {
    return [options.startWith, loading, error]
  } else {
    return [value, loading, error]
  }

}

export {
  useDocumentDataSSR,
  useCollectionDataSSR
}