import Alert from "@/components/custom-ui/Alert"
import { ALERT_LEVELS } from "../utils/constants"

export default function Test() {
  return (
    <div>
      {ALERT_LEVELS.map(l => (
        <Alert level={l} key={l} className="mb-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.{" "}
          </p>
          <b>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.{" "}
          </b>
        </Alert>
      ))}
    </div>
  )
}
