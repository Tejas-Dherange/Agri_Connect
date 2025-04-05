import ChatBot from "@/components/ChatBot"

export default function FarmerChat() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Chat with Expert</h1>
      <p className="mb-6">
        Ask questions about crop management, pest control, or any agricultural concerns. Our experts are here to help!
      </p>

      <ChatBot />
    </div>
  )
}

