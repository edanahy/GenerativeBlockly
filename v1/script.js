// Initialize Blockly
const workspace = Blockly.inject('blocklyDiv', {
	toolbox: `
		<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
			<block type="controls_if"></block>
			<block type="logic_compare"></block>
			<block type="logic_operation"></block>
			<block type="controls_repeat_ext"></block>
			<block type="logic_boolean"></block>
			<block type="math_number"></block>
			<block type="math_arithmetic"></block>
			<block type="text"></block>
			<block type="text_print"></block>
		</xml>
	`
});

// Chat functionality with Blockly code snippet display
function sendMessage() {
	const chatInput = document.getElementById('chatInput');
	const chatDisplay = document.getElementById('chatDisplay');
	const userMessage = chatInput.value;

	if (userMessage.trim() === '') return;

	// Display user's message
	const userMessageElement = document.createElement('div');
	userMessageElement.textContent = userMessage;
	userMessageElement.classList.add('chat-bubble', 'user-message');
	chatDisplay.appendChild(userMessageElement);

	// Generate AI response
	const aiResponse = generateAIResponse(userMessage);

	// Display AI's response (text part)
	const aiMessageElement = document.createElement('div');
	aiMessageElement.classList.add('chat-bubble', 'ai-message');
	aiMessageElement.innerHTML = aiResponse.text; // Display text response
	chatDisplay.appendChild(aiMessageElement);

	// If there's Blockly code, create a temporary Blockly workspace in the chat
	if (aiResponse.blockXml) {
		const blockContainer = document.createElement('div');
		blockContainer.classList.add('block-snippet');
		
		// Add a container for the temporary Blockly workspace
		const tempBlocklyDiv = document.createElement('div');
		tempBlocklyDiv.classList.add('temp-blockly-div');
		blockContainer.appendChild(tempBlocklyDiv);

		// Add an "Add to Canvas" button
		const addButton = document.createElement('button');
		addButton.textContent = "Add to Canvas";
		addButton.classList.add('add-button');
		addButton.onclick = () => addBlocklyCodeToCanvas(aiResponse.blockXml);

		blockContainer.appendChild(addButton);
		aiMessageElement.appendChild(blockContainer);

		// Create a temporary, read-only Blockly workspace
		const tempWorkspace = Blockly.inject(tempBlocklyDiv, {
			readOnly: true,
			toolbox: null,
			scrollbars: false,
		});

		// Render the Blockly XML into this temporary workspace
		const parser = new DOMParser();
		const xmlDom = parser.parseFromString(aiResponse.blockXml, "text/xml").documentElement;
		Blockly.Xml.domToWorkspace(xmlDom, tempWorkspace);
	}

	// Clear input
	chatInput.value = '';

	// Scroll to the bottom of the chat display
	chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// Function to add Blockly code from XML to the main workspace
function addBlocklyCodeToCanvas(xmlText) {
	const parser = new DOMParser();
	const xmlDom = parser.parseFromString(xmlText, "text/xml").documentElement;
	Blockly.Xml.domToWorkspace(xmlDom, workspace);
}

// Mock AI response (replace with actual API call)
function generateAIResponse(message) {
	// Example response with Blockly code snippet for a simple repeat loop
	return {
		text: "Here’s an example of a repeat loop you can use:",
		blockXml: `
			<xml xmlns="https://developers.google.com/blockly/xml">
				<block type="controls_repeat_ext" x="10" y="10">
					<value name="TIMES">
						<shadow type="math_number">
							<field name="NUM">5</field>
						</shadow>
					</value>
					<statement name="DO">
						<block type="text_print">
							<value name="TEXT">
								<shadow type="text">
									<field name="TEXT">Hello</field>
								</shadow>
							</value>
						</block>
					</statement>
				</block>
			</xml>
		`
	};
}
