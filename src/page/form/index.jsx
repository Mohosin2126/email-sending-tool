import { useForm } from "react-hook-form";

export default function Mailer(){
    const { register, handleSubmit, formState: { errors } } = useForm();
  
    const onSubmit = (data) => {
      // Handle form submission
      console.log(data);
    };
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-semibold text-gray-800 text-center">Email Sending Tool</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="gmailAccount" className="block font-bold text-gray-700">Upload Gmail Accounts (CSV):</label>
          <input
            type="file"
            id="gmailAccount"
            accept=".csv"
            {...register('gmailAccount')}
            className="w-full p-2 mt-1 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="recipientEmails" className="block font-bold text-gray-700">Upload Recipient Emails (CSV):</label>
          <input
            type="file"
            id="recipientEmails"
            accept=".csv"
            {...register('recipientEmails')}
            className="w-full p-2 mt-1 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="senderName" className="block font-bold text-gray-700">Sender Name:</label>
          <input
            type="text"
            id="senderName"
            placeholder="Enter sender name"
            {...register('senderName', { required: true })}
            className="w-full p-2 mt-1 border border-gray-300 rounded"
          />
          {errors.senderName && <p className="text-red-500 text-sm">Sender name is required</p>}
        </div>

        <div>
          <label htmlFor="subject" className="block font-bold text-gray-700">Subject:</label>
          <input
            type="text"
            id="subject"
            placeholder="Enter email subject"
            {...register('subject', { required: true })}
            className="w-full p-2 mt-1 border border-gray-300 rounded"
          />
          {errors.subject && <p className="text-red-500 text-sm">Subject is required</p>}
        </div>

        <div>
          <label htmlFor="htmlTemplate" className="block font-bold text-gray-700">HTML Template (Optional):</label>
          <input
            type="file"
            id="htmlTemplate"
            accept=".html"
            {...register('htmlTemplate')}
            className="w-full p-2 mt-1 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="delay" className="block font-bold text-gray-700">Delay Between Emails (Seconds):</label>
          <input
            type="number"
            id="delay"
            defaultValue={3}
            {...register('delay', { valueAsNumber: true })}
            className="w-full p-2 mt-1 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send Emails
        </button>
      </form>
    </div>
  );
};

