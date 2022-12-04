import { Select, Option, Input, Button } from "@material-tailwind/react";

const options = ["GET", "POST", "UPDATE", "DELETE"];

function App() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Submit");
      }}
    >
      <div className="flex p-6 items-center">
        <Select
          color="blue-gray"
          onChange={(e) => console.log(e)}
          variant="outlined"
          label="Method"
        >
          {options.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
        <div className="w-72">
          <Input
            label="https://example.com"
            className="px-3 text-base"
            variant="outlined"
          />
        </div>
        <Button type="submit" color="blue-gray">
          Send
        </Button>
      </div>
    </form>
  );
}

export default App;
