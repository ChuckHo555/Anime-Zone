"use client"

interface Props {
    data: any;
}

const Log = ({data} : Props) => {

    console.log(data);
  return (
    <div>Log</div>
  )
}

export default Log