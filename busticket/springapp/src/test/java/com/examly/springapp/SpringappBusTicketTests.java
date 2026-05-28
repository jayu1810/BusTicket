package com.examly.springapp;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ActiveProfiles("test")
@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
class SpringappBusTicketTests {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper om = new ObjectMapper();

    // -------------------- API Tests --------------------

    @Order(1)
    @Test
    void should_book_ticket_and_return_200() throws Exception {
        String ticketData = """
            {
              "passengerName": "John Doe",
              "route": "Mumbai-Delhi",
              "seatNumber": "A1",
              "bookingDateTime": "%s",
              "departureTime": "%s",
              "fare": 1200.0,
              "status": "BOOKED"
            }
        """.formatted(LocalDateTime.now(), LocalDateTime.now().plusDays(1));

        mockMvc.perform(post("/api/tickets/book")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(ticketData)
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.passengerName").value("John Doe"))
            .andExpect(jsonPath("$.route").value("Mumbai-Delhi"))
            .andExpect(jsonPath("$.seatNumber").value("A1"))
            .andExpect(jsonPath("$.fare").value(1200.0))
            .andExpect(jsonPath("$.status").value("BOOKED"));
    }

    @Order(2)
    @Test
    void should_allow_multiple_passengers_same_route() throws Exception {
        String ticketData = """
            {
              "passengerName": "Jane Smith",
              "route": "Mumbai-Delhi",
              "seatNumber": "A2",
              "bookingDateTime": "%s",
              "departureTime": "%s",
              "fare": 1200.0,
              "status": "BOOKED"
            }
        """.formatted(LocalDateTime.now(), LocalDateTime.now().plusDays(1));

        mockMvc.perform(post("/api/tickets/book")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(ticketData))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.passengerName").value("Jane Smith"));
    }

    @Order(3)
    @Test
    void should_return_all_tickets_as_array() throws Exception {
        mockMvc.perform(get("/api/tickets/all")
                .with(jwt())
                .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Order(4)
    @Test
    void should_return_tickets_by_route() throws Exception {
        mockMvc.perform(get("/api/tickets/byRoute")
                .with(jwt())
                .param("route", "Mumbai-Delhi")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Order(5)
    @Test
    void should_return_empty_array_for_nonexistent_route() throws Exception {
        mockMvc.perform(get("/api/tickets/byRoute")
                .with(jwt())
                .param("route", "NonexistentRoute")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(0));
    }

    @Order(6)
    @Test
    void should_return_tickets_sorted_by_date() throws Exception {
        mockMvc.perform(get("/api/tickets/sortedByDate")
                .with(jwt())
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Order(7)
    @Test
    void should_cancel_ticket_successfully() throws Exception {
        // Create a ticket first
        String ticketData = """
            {
              "passengerName": "Cancel Test",
              "route": "TempRoute",
              "seatNumber": "T1",
              "bookingDateTime": "%s",
              "departureTime": "%s",
              "fare": 500.0,
              "status": "BOOKED"
            }
        """.formatted(LocalDateTime.now(), LocalDateTime.now().plusDays(1));

        String response = mockMvc.perform(post("/api/tickets/book")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(ticketData)
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString(StandardCharsets.UTF_8);

        JsonNode node = om.readTree(response);
        long id = node.get("id").asLong();
        assertTrue(id > 0);

        // Cancel the ticket
        mockMvc.perform(put("/api/tickets/cancel/{id}", id).with(jwt()))
            .andExpect(status().isOk());
    }

    @Order(8)
    @Test
    void should_get_statistics() throws Exception {
        mockMvc.perform(get("/api/tickets/statistics")
                .with(jwt())
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalRevenue").exists())
            .andExpect(jsonPath("$.activeBookings").exists())
            .andExpect(jsonPath("$.totalTickets").exists());
    }

    @Order(9)
    @Test
    void should_handle_multiple_routes_same_passenger() throws Exception {
        String ticketData1 = """
            {
              "passengerName": "Alice Brown",
              "route": "Delhi-Bangalore",
              "seatNumber": "B1",
              "bookingDateTime": "%s",
              "departureTime": "%s",
              "fare": 1800.0,
              "status": "BOOKED"
            }
        """.formatted(LocalDateTime.now(), LocalDateTime.now().plusDays(2));

        String ticketData2 = """
            {
              "passengerName": "Alice Brown",
              "route": "Chennai-Hyderabad",
              "seatNumber": "C1",
              "bookingDateTime": "%s",
              "departureTime": "%s",
              "fare": 800.0,
              "status": "BOOKED"
            }
        """.formatted(LocalDateTime.now(), LocalDateTime.now().plusDays(3));

        mockMvc.perform(post("/api/tickets/book")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(ticketData1))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.route").value("Delhi-Bangalore"));

        mockMvc.perform(post("/api/tickets/book")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(ticketData2))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.route").value("Chennai-Hyderabad"));
    }

    @Order(10)
    @Test
    void should_allow_same_seat_different_routes() throws Exception {
        String ticketData1 = """
            {
              "passengerName": "Bob Wilson",
              "route": "Pune-Goa",
              "seatNumber": "A1",
              "bookingDateTime": "%s",
              "departureTime": "%s",
              "fare": 600.0,
              "status": "BOOKED"
            }
        """.formatted(LocalDateTime.now().minusMinutes(30), LocalDateTime.now().plusDays(1));

        String ticketData2 = """
            {
              "passengerName": "Charlie Davis",
              "route": "Kolkata-Bhubaneswar",
              "seatNumber": "A1",
              "bookingDateTime": "%s",
              "departureTime": "%s",
              "fare": 700.0,
              "status": "BOOKED"
            }
        """.formatted(LocalDateTime.now(), LocalDateTime.now().plusDays(2));

        mockMvc.perform(post("/api/tickets/book")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(ticketData1))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.seatNumber").value("A1"));

        mockMvc.perform(post("/api/tickets/book")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(ticketData2))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.seatNumber").value("A1"));
    }

    // -------------------- Project Structure Tests --------------------

    @Test
    void controller_directory_should_exist() { 
        assertDir("src/main/java/com/examly/springapp/controller"); 
    }

    @Test
    void ticket_controller_file_should_exist() { 
        assertFile("src/main/java/com/examly/springapp/controller/BusTicketController.java"); 
    }

    @Test
    void model_directory_should_exist() { 
        assertDir("src/main/java/com/examly/springapp/model"); 
    }

    @Test
    void ticket_model_file_should_exist() { 
        assertFile("src/main/java/com/examly/springapp/model/BusTicket.java"); 
    }

    @Test
    void repository_directory_should_exist() { 
        assertDir("src/main/java/com/examly/springapp/repository"); 
    }

    @Test
    void ticket_repository_file_should_exist() { 
        assertFile("src/main/java/com/examly/springapp/repository/BusTicketRepository.java"); 
    }

    @Test
    void service_directory_should_exist() { 
        assertDir("src/main/java/com/examly/springapp/service"); 
    }

    @Test
    void ticket_service_interface_should_exist() { 
        checkClassExists("com.examly.springapp.service.BusTicketService"); 
    }

    @Test
    void ticket_service_impl_class_should_exist() { 
        checkClassExists("com.examly.springapp.service.BusTicketServiceImpl"); 
    }

    @Test
    void ticket_model_should_have_required_fields() { 
        checkFieldExists("com.examly.springapp.model.BusTicket", "passengerName");
        checkFieldExists("com.examly.springapp.model.BusTicket", "route");
        checkFieldExists("com.examly.springapp.model.BusTicket", "seatNumber");
        checkFieldExists("com.examly.springapp.model.BusTicket", "bookingDateTime");
        checkFieldExists("com.examly.springapp.model.BusTicket", "departureTime");
        checkFieldExists("com.examly.springapp.model.BusTicket", "fare");
        checkFieldExists("com.examly.springapp.model.BusTicket", "status");
    }

    @Test
    void project_structure_and_classes_should_exist() {
        // Check configuration files
        assertFile("src/main/java/com/examly/springapp/configuration/SecurityConfig.java");
        assertFile("src/main/java/com/examly/springapp/configuration/JWTUtil.java");
        assertFile("src/main/java/com/examly/springapp/configuration/CorsConfigBean.java");
    
        // Check exception directory
        assertDir("src/main/java/com/examly/springapp/exception");
    
        // Check specific classes
        checkClassExists("com.examly.springapp.exception.TicketNotFoundException");
        checkClassExists("com.examly.springapp.util.BusTicketDataLoader");
    }
    

    // -------------------- Helpers --------------------

    private void assertDir(String path) {
        assertTrue(new java.io.File(path).exists(), "Missing directory: " + path);
    }

    private void assertFile(String path) {
        assertTrue(new java.io.File(path).exists(), "Missing file: " + path);
    }

    private void checkClassExists(String className) {
        try { 
            Class.forName(className); 
        }
        catch (ClassNotFoundException e) { 
            fail("Class " + className + " does not exist."); 
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (ClassNotFoundException | NoSuchFieldException e) {
            fail("Field " + fieldName + " in class " + className + " does not exist.");
        }
    }
}