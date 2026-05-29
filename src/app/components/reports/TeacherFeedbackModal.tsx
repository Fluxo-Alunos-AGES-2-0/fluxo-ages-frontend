import { Modal } from "../ui/Modal/Modal"; 

interface TeacherFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: {
    feedback: string;
  } | null;
}

export function TeacherFeedbackModal({ isOpen, onClose, reportData }: TeacherFeedbackModalProps) {
  if (!reportData) return null;

  const mockTeacher = {
    name: "Dilnei Venturini", 
  };

  const mockLoremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non leo et neque scelerisque malesuada. Duis et laoreet enim, a venenatis tortor. Ut congue urna eros. Nullam sagittis augue nec lacinia sollicitudin. Phasellus mattis enim in purus iaculis convallis. Duis tincidunt nisi quis urna suscipit, vel consectetur dui aliquet. Aenean aliquam magna quis urna commodo, ac lobortis neque mollis. Cras et sem nec quam auctor aliquet et eu odio. Vivamus aliquam tortor eu leo cursus placerat.\n\nMorbi tortor arcu, laoreet sed pulvinar at, tincidunt quis metus. Nam dignissim libero sed odio porta lacinia. Suspendisse sagittis nulla et vehicula commodo. Donec orci purus, malesuada sed auctor commodo, venenatis vitae nunc. Nullam venenatis accumsan tortor a maximus. Proin vitae velit ligula. Nam pharetra mi sed mattis accumsan. Curabitur ullamcorper neque non enim tempor, id placerat diam pretium. Suspendisse quis sapien nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nDuis et interdum leo. Sed efficitur, quam in auctor gravida, augue nisl lobortis nunc, in scelerisque ante nisi at leo. Cras ante tellus, aliquet et facilisis id, ornare vitae ligula. Suspendisse auctor, sapien sit amet imperdiet mattis, nisi sapien semper erat, vitae tempor enim purus id tellus. In eu est ut massa mollis placenta ut a sem. Pellentesque eu aliquam eros. Nulla et tortor mollis, commodo justo.";

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="" 
      className="max-w-[500px] [&_>_div:first-child]:from-[#ff7a00] [&_>_div:first-child]:to-[#ff9933]" 
    >
      <div className="-mt-6 text-[#374151]">
        
        <div className="border-b border-gray-100 pb-3 mb-4 pr-6">
          <h3 className="text-[22px] font-bold text-[#1f2937] leading-tight">
            Feedback do professor
          </h3>
          <p className="text-[14px] text-gray-400 mt-0.5">
            {mockTeacher.name}
          </p>
        </div>

        {/* Seção de Comentário */}
        <div className="mb-2">
          <h4 className="text-[14px] font-medium text-gray-500 mb-2">Comentário</h4>
          
          <div className="max-h-[360px] overflow-y-auto border border-gray-200 rounded-xl p-4 bg-white text-[14px] text-gray-600 leading-relaxed whitespace-pre-line
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-200
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-button]:hidden"
          >
            {reportData.feedback || mockLoremIpsum}
          </div>
        </div>
      </div>
    </Modal>
  );
}