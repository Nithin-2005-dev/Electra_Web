export default function SizeChartModal({ image, onClose }) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>
          ✕
        </button>
        <img src={image} />
      </div>
    </div>
  );
}
